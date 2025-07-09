import { NotFoundException } from "@nestjs/common";

export class DocumentNotFoundException extends NotFoundException{
    constructor(id: number){
        super('Documento ${id} não encontrado');
    }
}