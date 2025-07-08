import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "../usuarios/usuarios.service";
import { UserToken } from "./models/user-token.model";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { UserPayload } from "./models/user-payload.model";
import { Role } from "../enums/role.enum";
import { compareSync } from "bcrypt";
import { ChangePasswordDto } from "src/usuarios/dto/change-password-usuario.dto";
import { InvalidPasswordException } from "src/shared/exceptions/invalid-password.exception";

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

    return {
      access_token: this.jwtService.sign(payload),
      token_type: "Bearer",
    };
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

  async changePassword(user: Usuario, changePasswordDto: ChangePasswordDto) {
    const usuario = await this.usuarioService.findByEmailcomSenha(user.email);
    console.log("Senha atual do banco: ", usuario.senha);
    console.log(
      "Senha atual da requisição: ",
      changePasswordDto.currentPassword
    );
    console.log("Senha nova da requisição: ", changePasswordDto.newPassword);

    const isPasswordValid = usuario?.senha
      ? compareSync(changePasswordDto.currentPassword, usuario.senha)
      : false;

    console.log("valor de compareSync = ", isPasswordValid);

    if (isPasswordValid) {
      console.log("aqui");
      await this.usuarioService.update(usuario.id, {
        senhaAtual: changePasswordDto.currentPassword,
        senha: changePasswordDto.newPassword,
      });
    } else {
      throw new InvalidPasswordException();
    }
  }
}
