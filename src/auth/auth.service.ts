import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { UserToken } from "./models/user-token.model";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { UserPayload } from "./models/user-payload.model";
import { Role } from "src/enums/role.enum";
import { compareSync } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly jwtService: JwtService
  ) {}

  async login(usuario: Usuario): Promise<UserToken> {
    const payload: UserPayload = {
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nomeCompleto,
      role: usuario.role,
    };
    return { acess_token: this.jwtService.sign(payload), token_type: "Bearer" };
  }

  async validaUsuario(email: string, senha: string, role: Role): Promise<Usuario | null> {
    const usuario = await this.usuarioService.findByEmail(email, false, role);

    if (usuario){
      const senhaValida = await compareSync(senha, usuario.senha);

      if (senhaValida){
        const {senha, ...resultado} = usuario;
        return resultado as Usuario;
      }
    }

    return null;
  }
}
