import { forwardRef, Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";
import { RequerimentosModule } from "src/requerimentos/requerimentos.module";
import { MailModule } from 'src/mail/mail.module';
import { SharedModule } from '../shared/shared.module';


@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Enfermeiro]),
    forwardRef(() => RequerimentosModule),
    MailModule,
    SharedModule,
  ],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}