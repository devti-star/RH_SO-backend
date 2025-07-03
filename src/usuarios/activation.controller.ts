import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsuariosService } from './usuarios.service';

@Controller('auth')
export class ActivationController {
  constructor(
    private readonly usuariosService: UsuariosService
  ) {}

  @Get('activate')
  async activateAccount(
    @Query('token') token: string,
    @Res() res: Response
  ) {
    try {
      // Ativar conta usando token
      await this.usuariosService.activateByToken(token);
      // Redireciona para página de sucesso
      return res.redirect(`${process.env.FRONTEND_URL}/activation-success`);
    } catch (error) {
      // Redireciona para página de erro
      return res.redirect(`${process.env.FRONTEND_URL}/activation-error?message=${encodeURIComponent(error.message)}`);
    }
  }
}