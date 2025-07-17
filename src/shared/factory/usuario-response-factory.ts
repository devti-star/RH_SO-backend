import { Role } from "src/enums/role.enum";
import { EnfermeiroResponseDto } from "src/usuarios/dto/enfermeiro-response.dto";
import { MedicoResponseDto } from "src/usuarios/dto/medico-response.dto";
import { UsuarioResponseDto } from "src/usuarios/dto/usuario-response.dto";
import { Enfermeiro, Medico, Usuario } from "src/usuarios/entities/usuario.entity";


export class UsuarioResponseFactory {
    static createResponse(usuario: Usuario | Enfermeiro | Medico, role: Role):  UsuarioResponseDto | EnfermeiroResponseDto | MedicoResponseDto{
        switch(role) {
            case Role.MEDICO:
                return new MedicoResponseDto(usuario as Medico);
            case Role.ENFERMEIRO:
                return new EnfermeiroResponseDto(usuario as Enfermeiro);
            default:
                return new UsuarioResponseDto(usuario as Usuario);
        }

    }
}