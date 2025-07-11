import { forwardRef, Module } from "@nestjs/common";
import { RequerimentosService } from "./requerimentos.service";
import { RequerimentosController } from "./requerimentos.controller";
import { Documento, Atestado } from "src/documentos/entities/documento.entity"; // <--- inclua Atestado aqui!
import { TypeOrmModule } from "@nestjs/typeorm";
import { Historico } from "src/historicos/entities/historico.entity";
import { Requerimento } from "./entities/requerimento.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";

@Module({
  controllers: [RequerimentosController],
  providers: [RequerimentosService],
  imports: [
    TypeOrmModule.forFeature([Documento, Atestado, Requerimento, Historico]), // <--- inclua Atestado aqui!
    forwardRef(() => UsuariosModule),
  ],
  exports: [RequerimentosService], // Exporta só o service
})
export class RequerimentosModule {}
