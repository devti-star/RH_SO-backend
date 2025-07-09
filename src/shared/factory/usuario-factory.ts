import { Role } from "src/enums/role.enum";
import { CreateUsuarioDto } from "src/usuarios/dto/create-usuario.dto";
import { Enfermeiro, Medico, Usuario } from "src/usuarios/entities/usuario.entity";

export class Usuariofactory{
    static createUsuario(dto: CreateUsuarioDto): Usuario{
        switch(dto.role){
            case Role.PADRAO:
            case Role.RH:
            case Role.PS:
            case Role.ADMIN:
            case Role.TRIAGEM:
                return new Usuario(
                    dto.nomeCompleto,
                    dto.email,
                    dto.cpf,
                    dto.rg,
                    dto.orgaoExpeditor,
                    dto.senha,
                    dto.matricula,
                    dto.cargo,
                    dto.role,
                    dto.departamento,
                    dto.secretaria,
                    dto.telefone
                );
            
            case Role.MEDICO:
                return new Medico(
                    dto.nomeCompleto,
                    dto.email,
                    dto.cpf,
                    dto.rg,
                    dto.orgaoExpeditor,
                    dto.senha,
                    dto.matricula,
                    dto.cargo,
                    dto.role,
                    dto.crm as string,
                    dto.departamento,
                    dto.secretaria,
                    dto.telefone
                );

            case Role.ENFERMEIRO:
                return new Enfermeiro(
                    dto.nomeCompleto,
                    dto.email,
                    dto.cpf,
                    dto.rg,
                    dto.orgaoExpeditor,
                    dto.senha,
                    dto.matricula,
                    dto.cargo,
                    dto.role,
                    dto.cre as string,
                    dto.departamento,
                    dto.secretaria,
                    dto.telefone
                );   

            default:
                throw new Error('Role inválida'); 
        }
    }
}