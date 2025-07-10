import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { IsPublic } from "src/shared/decorators/is-public.decorator";
import { OtpDto } from "./dto/otp.dto";
import { UsuariosService } from "../usuarios.service";
import { CachedService } from "src/shared/services/cached.service";
import { ActivateService } from "./activate.service";
import { TokenGenerateService } from "src/shared/services/token-generate.service";
import { MailService } from "src/mail/mail.service";
import { Usuario } from "../entities/usuario.entity";
import { UsuarioResponseDto } from "../dto/usuario-response.dto";
import { ConfigService } from "@nestjs/config";

@IsPublic()
@Controller("activate")
export class ActivationController {
  constructor(
    private readonly tokenService: TokenGenerateService,
    private readonly activate_service: ActivateService,
    private readonly mailService: MailService,
    private readonly userService: UsuariosService,
    private readonly configService: ConfigService
  ) { }

  @Get(":token")
  @HttpCode(202)
  async activateAccount(@Param("token") token: string) {
    const id: number = await this.tokenService.validateToken(token);
    const usuario: UsuarioResponseDto = await this.userService.findOne(id);
    if (!usuario) {
      return;
    }
    await this.activate_service.activateUser(usuario?.idUsuario);
    if (usuario)
      this.mailService.sendActivatedEmail(
        usuario.email,
        usuario.nomeCompleto,
        this.configService.get<string>("URL_FRONT_APPLICATION")
      );
  }
}
