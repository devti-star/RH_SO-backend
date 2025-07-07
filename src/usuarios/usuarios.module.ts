import { Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";
import { MailModule } from 'src/mail/mail.module';
import { ActivateController } from './activate/activate.controller';
import { ActivateService } from './activate/activate.service';
import { ActivateModule } from './activate/activate.module';

@Module({
  controllers: [UsuariosController, ActivateController],
  providers: [UsuariosService, ActivateService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Enfermeiro, Requerimento]),
    MailModule,
    ActivateModule, // Importar MailModule
  ],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}