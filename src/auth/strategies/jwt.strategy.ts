import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from "src/usuarios/usuarios.service";
import { UserPayload } from "../models/user-payload.model";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: UserPayload): Promise<any>{
    try {
        return await this.usuariosService.findOne(payload.sub);
    } catch (error) {
        throw new UnauthorizedException('Usuário não encontrado');
    }
  }
  
}
