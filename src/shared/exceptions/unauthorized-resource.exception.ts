import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";

export class UnauthorizedResource extends HttpException{
    constructor(id: number){
        super('Acesso não autorizado', HttpStatus.FORBIDDEN);
    }
}