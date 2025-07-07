import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { OtpDto } from './dto/otp.dto';
import { UsuariosService } from '../usuarios.service';
import { CachedService } from 'src/shared/services/cached.service';
import { OtpGenerateService } from 'src/shared/services/otp-generate.service';

@IsPublic()
@Controller('activate')
export class ActivationController {
  constructor(
    private readonly usuariosService: UsuariosService, private readonly cached_service:CachedService
  ) {}

  @Post('otp')
  async activateAccount(@Body() otp:OtpDto){
    const id:string = await this.cached_service.getCached(otp.otpCode);
    
  }
}