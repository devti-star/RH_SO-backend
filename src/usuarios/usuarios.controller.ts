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
} from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { MailService } from 'src/mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Usuario } from "./entities/usuario.entity";

@UseGuards(RolesGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mailService: MailService
  ) {}

  @IsPublic()
  @Post('cadastrar')
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.criar(createUsuarioDto);
    return { message: 'Usuário criado com sucesso!', userId: usuario.id };
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

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ) {
    await this.usuariosService.update(+id, updateUsuarioDto);
    return { message: "Usuário atualizado com sucesso." };
  }

  @Patch('foto/:id')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './fotosUsuario',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    })
  )
  async uploadFoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    return this.usuariosService.salvarFoto(id, foto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usuariosService.remove(+id);
  }
}