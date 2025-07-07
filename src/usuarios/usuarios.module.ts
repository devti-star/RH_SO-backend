import { forwardRef, Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";
import { MailModule } from 'src/mail/mail.module';
import { ActivateService } from './activate/activate.service';
import { ActivateModule } from './activate/activate.module';
import { ActivationController } from "./activate/activate.controller";
import { SharedModule } from "src/shared/services/shared.module";

@Module({
  controllers: [UsuariosController, ActivationController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Enfermeiro, Requerimento]),
    MailModule,
    forwardRef (() => ActivateModule), // Importar MailModule
    SharedModule
  ],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}