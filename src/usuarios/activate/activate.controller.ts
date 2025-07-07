import { Body, Controller, Get, HttpCode, Patch, Post, Query, Res } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/is-public.decorator';
import { OtpDto } from './dto/otp.dto';
import { UsuariosService } from '../usuarios.service';
import { CachedService } from 'src/shared/services/cached.service';
import { OtpGenerateService } from 'src/shared/services/otp-generate.service';
import { ActivateService } from './activate.service';

@IsPublic()
@Controller('activate')
export class ActivationController {
  constructor(
    private readonly usuariosService: UsuariosService, private readonly cached_service:CachedService, private readonly activate_service:ActivateService
  ) {}

  @Patch('otp')
  @HttpCode(202)
  async activateAccount(@Body() otp:OtpDto){
    const id:number = await this.cached_service.getCached(otp.otpCode);
    this.activate_service.activateUser(id);
    await this.cached_service.deleteCached(otp.otpCode);
  }
}