import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';

@Injectable()
export class ActivateService {

    constructor(private readonly usuarioService:UsuariosService){};
    activateUser(id:number){
        this.usuarioService.update(id, {isActive: true, activatedAt:  new Date()})
    };

}
