import { NotFoundException } from "@nestjs/common";

export class UsuarioUnauthenticate extends NotFoundException{
    constructor(){
        super('Usuario não encontrado autênticado');
    }
}