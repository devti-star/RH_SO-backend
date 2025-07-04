import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@IsPublic()
@UseGuards(RolesGuard)
@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imagemPerfil', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  async create(
    @UploadedFile() imagemPerfil: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.criar(createUsuarioDto, imagemPerfil);
    return { message: 'Usuário criado com sucesso!', imagemPerfil: usuario.foto };
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
  @UseInterceptors(
    FileInterceptor('imagemPerfil', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  async update(
    @Param("id") id: string,
    @UploadedFile() imagemPerfil: Express.Multer.File,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuariosService.update(+id, updateUsuarioDto, imagemPerfil);
    return { message: "Usuário atualizado com sucesso.", imagemPerfil: usuario.foto };
  }


  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usuariosService.remove(+id);
  }
}
