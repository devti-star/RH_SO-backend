import { forwardRef, Module } from "@nestjs/common";
import { RequerimentosService } from "./requerimentos.service";
import { RequerimentosController } from "./requerimentos.controller";
import { Documento, Atestado } from "src/documentos/entities/documento.entity"; // <--- inclua Atestado aqui!
import { TypeOrmModule } from "@nestjs/typeorm";
import { Historico } from "src/historicos/entities/historico.entity";
import { Requerimento } from "./entities/requerimento.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { HistoricosModule } from "src/historicos/historicos.module";

@Module({
  controllers: [RequerimentosController],
  providers: [RequerimentosService],
  imports: [
    TypeOrmModule.forFeature([Documento, Requerimento, Atestado, Historico]),
    forwardRef(() => UsuariosModule), // CORRETO!
    forwardRef(() => RequerimentosModule),
    forwardRef(() => HistoricosModule),
  ],
  exports: [RequerimentosService], // Exporta só o service
})
export class RequerimentosModule {}
