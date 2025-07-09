import { NotFoundException } from "@nestjs/common";

export class HistoricoNotFoundException extends NotFoundException{
    constructor(id: number){
        super(`Registro do histórico do requerimento ${id} não encontrado`);
    }
}