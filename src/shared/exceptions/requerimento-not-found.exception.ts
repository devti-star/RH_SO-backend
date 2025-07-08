import { NotFoundException } from "@nestjs/common";

export class RequerimentoNotFoundException extends NotFoundException{
    constructor(id: number){
        super('Requerimento ${id} não encontrado');
    }
}