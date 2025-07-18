import { ForbiddenException } from "@nestjs/common";

export class DisableUser extends ForbiddenException{
    constructor(){
        super("Usuário não ativado no sistema")
    }
}