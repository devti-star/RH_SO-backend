import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';

@Injectable()
export class ActivateService {

    constructor(private readonly usuarioService:UsuariosService){};
    async activateUser(id:number): Promise<void> {
        this.usuarioService.update(id, {isActive: true, activatedAt:  new Date()})
    };

}
