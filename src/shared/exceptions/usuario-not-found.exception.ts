import { NotFoundException } from "@nestjs/common";

export class UsuarioNotFoundException extends NotFoundException{
    constructor(id: number){
        super('Usuario ${id} não encontrado');
    }
}