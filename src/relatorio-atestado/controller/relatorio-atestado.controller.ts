import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { RelatorioAtestadoService } from "../relatorio-atestado.service";

@Controller('relatorio-atestado')
export class RelatorioAtestadoController{
    constructor(private readonly relatorioAtestadoService: RelatorioAtestadoService){}

    @Get(':idRequerimento')
    async create(@Param('idRequerimento', ParseIntPipe) idRequerimento: number){
        return this.relatorioAtestadoService.create(idRequerimento);
    }

}