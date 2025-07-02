import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) 
  login(@CurrentUser() usuario: Usuario){
    return this.authService.login(usuario);
  }

  @ApiPaginatedResponse(Usuario)
  @Get('me')
  me(@CurrentUser() usuario: Usuario){
    return usuario;
  }
}
