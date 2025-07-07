
import { Exclude, Expose} from "class-transformer";
import { Usuario } from "../entities/usuario.entity";
import { Role } from "src/enums/role.enum";
import { RG } from "src/rg/entities/rg.entity";
import { RGResponseDto } from "src/rg/dto/rg-reponse.dto";


export class UsuarioResponseDto {
  constructor(usuario: Usuario){
      this.id = usuario.id,
      this.nomeCompleto = usuario.nomeCompleto,
      this.cpf = usuario.cpf,
      this.rg = usuario.rg,
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
  rg: RGResponseDto;
  email: string;
  matricula: string;
  secretaria: string;
  departamento: string;
  telefone: string;
  cargo: string;
  foto?: string | null;
  role: Role;

}

