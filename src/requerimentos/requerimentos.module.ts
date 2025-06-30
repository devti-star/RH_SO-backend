import { Module } from "@nestjs/common";
import { RequerimentosService } from "./requerimentos.service";
import { RequerimentosController } from "./requerimentos.controller";
import { Documento } from "src/documentos/entities/documento.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  controllers: [RequerimentosController],
  providers: [RequerimentosService],
  imports: [TypeOrmModule.forFeature([Documento])],
})
export class RequerimentosModule {}
