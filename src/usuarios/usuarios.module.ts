import { Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Medico, Enfermeiro, Requerimento]),
  ],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
