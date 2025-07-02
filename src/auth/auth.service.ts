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
    };

    return { acess_token: this.jwtService.sign(payload), token_type: 'Bearer' };
  }

  async validaUsuario(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.usuarioService.findByEmailcomSenha(email);

    const isPasswordValid = usuario?.senha
      ? compareSync(senha, usuario?.senha)
      : false;

    if (isPasswordValid) {
      delete usuario?.senha;
      return usuario;
    }

    return null;
  }
}
