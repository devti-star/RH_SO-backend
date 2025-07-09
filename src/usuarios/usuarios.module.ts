import { forwardRef, Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { RequerimentosModule } from "src/requerimentos/requerimentos.module";
import { MailModule } from 'src/mail/mail.module';
import { ActivateService } from './activate/activate.service';
import { ActivateModule } from './activate/activate.module';
import { ActivationController } from "./activate/activate.controller";
import { SharedModule } from "src/shared/services/shared.module";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";
import { AuthModule } from "src/auth/auth.module";


@Module({
  controllers: [UsuariosController, ActivationController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Enfermeiro]),
    MailModule,
    forwardRef (() => ActivateModule), // Importar MailModule
    forwardRef(() => RequerimentosModule),
    AuthModule,
    SharedModule

  ],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}