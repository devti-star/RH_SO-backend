import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';

@Injectable()
export class ActivateService {

    constructor(private readonly usuarioService:UsuariosService){};
    async activateUser(idUsuario:number = 0): Promise<void> {
        await this.usuarioService.update(idUsuario, {isActive: true, activatedAt:  new Date()})
    };

}
