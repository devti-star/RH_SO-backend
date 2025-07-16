import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelatorioAtestado } from "../entities/relatorio-atestado.viewentity";
import { RelatorioAtestadoController } from "../controller/relatorio-atestado.controller";
import { RelatorioAtestadoService } from "../relatorio-atestado.service";


@Module({
  controllers: [RelatorioAtestadoController],
  providers: [RelatorioAtestadoService],
  imports: [TypeOrmModule.forFeature([RelatorioAtestado])],
  exports: [TypeOrmModule, RelatorioAtestadoService]
})
export class RelatorioAtestadoModule {}
