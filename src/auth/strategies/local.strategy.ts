import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({usernameField: 'email'});
    }

    async validate(email: string, senha: string): Promise<Usuario>{
        const usuario = await this.authService.validaUsuario(email, senha);

        if (!usuario){
            throw new UnauthorizedException('Email ou senha incorretos');
        }

        return usuario;
    }
}