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
} from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { MailService } from 'src/mail/mail.service';
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@IsPublic()
@UseGuards(RolesGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mailService: MailService
  ) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.criar(createUsuarioDto);
    
    // Enviar email de ativação
    await this.mailService.sendActivationEmail(
      usuario.email,
      usuario.nomeCompleto,
      usuario.activationToken
    );
    
    return { 
      message: "Usuário criado com sucesso! Verifique seu email para ativar a conta.",
      userId: usuario.id
    };
  }

  @Roles(Role.ADMIN, Role.ENFERMEIRO, Role.MEDICO, Role.PS, Role.RH, Role.TRIAGEM)
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UsuarioResponseDto> {
    return this.usuariosService.findOne(+id);
  }
  

  @Get('buscar/email')
  @Roles(Role.ADMIN)
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