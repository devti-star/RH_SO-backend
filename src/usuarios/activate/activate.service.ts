import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';

@Injectable()
export class ActivateService {

    constructor(private readonly usuarioService:UsuariosService){};
    async activateUser(id:number = 0): Promise<void> {
        await this.usuarioService.update(id, {isActive: true, activatedAt:  new Date()})
    };

}
