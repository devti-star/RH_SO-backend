import { forwardRef, Module } from "@nestjs/common";
import { HistoricosService } from "./historicos.service";
import { HistoricosController } from "./historicos.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Requerimento } from "src/requerimentos/entities/requerimento.entity";
import { Historico } from "./entities/historico.entity";
import { UsuariosModule } from "src/usuarios/usuarios.module";
import { RequerimentosModule } from "src/requerimentos/requerimentos.module";

@Module({
  controllers: [HistoricosController],
  providers: [HistoricosService],
  imports: [
    TypeOrmModule.forFeature([Requerimento, Historico]),
    forwardRef(() => UsuariosModule),
    forwardRef(() => RequerimentosModule),
  ],
  exports: [HistoricosService],
})
export class HistoricosModule {}
