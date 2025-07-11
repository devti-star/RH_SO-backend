import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";

export class UnauthorizedResource extends HttpException{
    constructor(){
        super('Acesso não autorizado', HttpStatus.FORBIDDEN);
    }
}