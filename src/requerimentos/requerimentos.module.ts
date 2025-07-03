import { forwardRef, Module } from "@nestjs/common";
import { RequerimentosService } from "./requerimentos.service";
import { RequerimentosController } from "./requerimentos.controller";
import { Documento } from "src/documentos/entities/documento.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Historico } from "src/historicos/entities/historico.entity";
import { Requerimento } from "./entities/requerimento.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";


@Module({
  controllers: [RequerimentosController],
  providers: [RequerimentosService],
  imports: [
    TypeOrmModule.forFeature([Documento, Requerimento, Historico]),
    forwardRef(() => UsuariosModule), // CORRETO!
  ],
  exports: [TypeOrmModule, RequerimentosService],
})
export class RequerimentosModule {}
