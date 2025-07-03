import { Exclude, Expose} from "class-transformer";
import { Usuario } from "../entities/usuario.entity";
import { Role } from "src/enums/role.enum";


export class UsuarioResponseDto {
  constructor(usuario: Usuario){
      this.id = usuario.id,
      this.nomeCompleto = usuario.nomeCompleto,
      this.cpf = usuario.cpf,
      this.email = usuario.email,
      this.matricula = usuario.matricula,
      this.secretaria = usuario.secretaria,
      this.departamento = usuario.departamento,
      this.telefone = usuario.telefone,
      this.cargo = usuario.cargo,
      this.foto = usuario.foto,
      this.role = usuario.role
    }
  
  id: number;
  nomeCompleto: string;
  cpf: string;
  email: string;
  matricula: string;
  secretaria: string;
  departamento: string;
  telefone: string;
  cargo: string;
  foto?: string;
  role: Role;

}
