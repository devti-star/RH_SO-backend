import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { MailService } from 'src/mail/mail.service';
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { TokenGenerateService } from "src/shared/services/token-generate.service";
import { ConfigService } from "@nestjs/config";

@IsPublic()
@Controller("usuarios")
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mailService: MailService,
    private readonly tokenService:TokenGenerateService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.criar(createUsuarioDto);
    const token = await this.tokenService.generateToken(usuario.id);
    const link = this.configService.get<string>("ACTIVATE_LINK") + "/" + token;
    console.log(link);
    console.log(usuario.email);
    // Enviar email de ativação
    await this.mailService.sendActivationEmail(
      usuario.email,
      usuario.nomeCompleto,
      link
    );
    
    return { 
      message: "Usuário criado com sucesso! Verifique seu email para ativar a conta.",
      userId: usuario.id
    };
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UsuarioResponseDto> {
    return this.usuariosService.findOne(+id);
  }
  

  @Get('buscar/email')
  findByEmail(@Query('email') email: string) {
    return this.usuariosService.findByEmail(email);
  }


  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuariosService.update(+id, updateUsuarioDto);
    return { message: "Usuário atualizado com sucesso." };
  }


  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usuariosService.remove(+id);
  }
}