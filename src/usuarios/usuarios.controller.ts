import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  BadRequestException,
  HttpCode,
  Res,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { MailService } from "src/mail/mail.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { TokenGenerateService } from "src/shared/services/token-generate.service";
import { ConfigService } from "@nestjs/config";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Usuario } from "./entities/usuario.entity";
import { ChangePasswordDto } from "./dto/change-password-usuario.dto";
import { AuthService } from "src/auth/auth.service";
import * as fs from "fs";
import { compareSync } from "bcrypt";
import { ResetPasswordDto } from "./dto/reset-password-usuario.dto";
import { ForgotPassword } from "./dto/forgot_password.dto";

import { DefaultIdGuard } from "src/auth/guards/check-id-default-user.guard";

@UseGuards(RolesGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenGenerateService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) { }

  @Post()
  @IsPublic()
  @HttpCode(201)
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.criar(createUsuarioDto);
    const token = await this.tokenService.generateToken(usuario.id);
    const link = this.configService.get<string>("URL_FRONT_APPLICATION") + "/activate/" + token;

    await this.mailService.sendActivationEmail(
      usuario.email,
      usuario.nomeCompleto,
      link
    );

    return {
      message:
        "Usuário criado com sucesso! Verifique seu email para ativar a conta.",
    };
  }

  @Post("/forgotpassword")
  @IsPublic()
  @HttpCode(200)
  async forgot_password(@Body() forgotPassword: ForgotPassword) {
    const usuario = await this.usuariosService.findByEmail(forgotPassword.email);
    const token = await this.tokenService.generateToken(usuario.id);
    const link = this.configService.get<string>("FORGOT_PASSWORD") + "/" + token;

    await this.mailService.sendRecoveryEmail(
      usuario.email,
      usuario.nomeCompleto,
      link
    );

    return {
      message:
        "Email enviado com Sucesso.",
    };
  }

  @Patch("foto/:id")
  @UseInterceptors(
    FileInterceptor("foto", {
      storage: diskStorage({
        destination: "./fotosUsuario",
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${req.params.id}_profile${ext}`);
        },
      }),
      // (opcional: filtro de tipo/limite de tamanho)
      // fileFilter: ...
    })
  )
  async uploadFoto(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() foto: Express.Multer.File,
    @CurrentUser() usuario: Usuario,
  ) {
    console.log('Upload de foto:', {
      id,
      usuarioId: usuario.id,
      usuarioRole: usuario.role,
      file: foto,
      filePath: foto?.path,
      fileName: foto?.filename,
    });

    if (usuario.id !== id && usuario.role !== Role.ADMIN) {
      throw new HttpException("Você só pode alterar sua própria foto.", HttpStatus.FORBIDDEN);
    }
    if (!foto) throw new BadRequestException("Foto não enviada!");

    // Atualize no banco:
    await this.usuariosService.atualizarFoto(id, foto.filename);
    return { message: "Foto salva com sucesso.", foto: foto.filename };
  }
  
  @Get("foto/:id")
  async serveFoto(
    @Param("id", ParseIntPipe) id: number,
    @Res() res,
    @CurrentUser() usuario: Usuario
  ) {
    // Só o dono ou admin pode acessar
    if (usuario.id !== id && usuario.role !== Role.ADMIN) {
      throw new ForbiddenException("Acesso negado");
    }
    // Pegue o usuário e verifique se há foto
    const user = await this.usuariosService.findOne(id, ["foto"]);
    if (!user || !user.foto) throw new NotFoundException();
    const caminho = path.join(process.cwd(), "fotosUsuario", user.foto);

    // Verifique se o arquivo existe
    if (!fs.existsSync(caminho)) throw new NotFoundException();

    // Envie o arquivo de forma segura
    return res.sendFile(caminho);
  }

  @Roles(
    Role.ADMIN,
    Role.ENFERMEIRO,
    Role.MEDICO,
    Role.PS,
    Role.RH,
    Role.TRIAGEM
  )
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(":id/requerimentos")
  findAllRequerimentosOfUser(@Param("id", ParseIntPipe) id: number) {
    return this.usuariosService.findAllRequerimentsOfUser(id);
  }

  // Implementado
  /*  
      Apenas médico e admin podem ver todas as infomações de qualquer usuário
      Usuário padrão vê apenas as próprias informações
      Demais roles tem acesso limitado às informações dos demais usuários (rg e cpf ficam de fora)
  */
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() usuario: Usuario
  ): Promise<Partial<UsuarioResponseDto>> {
    const campos = this.usuariosService.getColumnsforUser(usuario, id);

    return this.usuariosService.findOne(+id, campos);
  }

  @Get("buscar/email")
  @Roles(Role.ADMIN)
  findByEmail(@Query("email") email: string) {
    return this.usuariosService.findByEmail(email);
  }

  @Patch("recoverypassword/:token")
  @IsPublic()
  async RecoveryPassword(@Param("token") token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    const id: number = await this.tokenService.validateToken(token);
    const usuario = await this.usuariosService.findOne(id);
    await this.usuariosService.update(id, { senha: resetPasswordDto.newPassword });
    await this.mailService.sendConfirmateRecoveryEmail(
      usuario.email,
      usuario.nomeCompleto,
    );
    return { message: "Senha alterado com sucesso." }
  }

  @Patch("mudar-senha")
  async changePassword(
    @CurrentUser() user: Usuario,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    await this.authService.changePassword(user, changePasswordDto);
    return { message: "Senha alterada com sucesso!" };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ) {
    await this.usuariosService.update(id, updateUsuarioDto);
    return { message: "Usuário atualizado com sucesso." };
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
