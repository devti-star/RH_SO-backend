import { Injectable } from "@nestjs/common";
import { UsuariosService } from "src/usuarios/usuarios.service";

@Injectable()
export class IsUserActivatedStrategy{
    constructor(private readonly userService: UsuariosService){}

    async validate(usuarioId: number){

    }
}