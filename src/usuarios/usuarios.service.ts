import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Role } from "src/enums/role.enum";

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
    @InjectRepository(Medico)
    private readonly repositorioMedico: Repository<Medico>,
    @InjectRepository(Enfermeiro)
    private readonly repositorioEnfermeiro: Repository<Enfermeiro>
  ) {}

  async criar(createUsuarioDto: CreateUsuarioDto) {
    try{
      const novoUsuario = this.criaUsuarioPorRole(createUsuarioDto);
      await this.salvaUsuarioPorRole(novoUsuario);
    } catch (error) {
      throw new BadRequestException(error.message || 'Erro ao criar usuário.');
    }
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  private criaUsuarioPorRole(
    criaUsuarioDto: CreateUsuarioDto
  ): Usuario | Medico | Enfermeiro {
    switch (criaUsuarioDto.role) {
      case Role.PADRAO:
      case Role.TRIAGEM: 
        return new Usuario(
          criaUsuarioDto.nomeCompleto,
          criaUsuarioDto.email,
          criaUsuarioDto.cpf,
          criaUsuarioDto.rg,
          criaUsuarioDto.orgaoExpeditor,
          criaUsuarioDto.senha,
          criaUsuarioDto.matricula,
          criaUsuarioDto.cargo,
          criaUsuarioDto.role,
          criaUsuarioDto.departamento,
          criaUsuarioDto.secretaria,
          criaUsuarioDto.telefone,
        );

      case Role.MEDICO:
        return new Medico(
          criaUsuarioDto.nomeCompleto,
          criaUsuarioDto.email,
          criaUsuarioDto.cpf,
          criaUsuarioDto.rg,
          criaUsuarioDto.orgaoExpeditor,
          criaUsuarioDto.senha,
          criaUsuarioDto.matricula,
          criaUsuarioDto.cargo,
          criaUsuarioDto.role,
          criaUsuarioDto.crm as string,
          criaUsuarioDto.departamento,
          criaUsuarioDto.secretaria,
          criaUsuarioDto.telefone,
        );

      case Role.ENFERMEIRO:
        return new Enfermeiro(
          criaUsuarioDto.nomeCompleto,
          criaUsuarioDto.email,
          criaUsuarioDto.cpf,
          criaUsuarioDto.rg,
          criaUsuarioDto.orgaoExpeditor,
          criaUsuarioDto.senha,
          criaUsuarioDto.matricula,
          criaUsuarioDto.cargo,
          criaUsuarioDto.role,
          criaUsuarioDto.cre as string,
          criaUsuarioDto.departamento,
          criaUsuarioDto.secretaria,
          criaUsuarioDto.telefone,
        );

      default:
        throw new Error("Role inválida");
    }
  }

  private salvaUsuarioPorRole(usuario: Usuario | Medico | Enfermeiro) {
    switch (usuario.role) {
      case Role.PADRAO:
      case Role.TRIAGEM: 
        return this.repositorioUsuario.save(usuario)
      case Role.MEDICO:
        return this.repositorioMedico.save(usuario);
      case Role.ENFERMEIRO:
        return this.repositorioEnfermeiro.save(usuario);
      default:
        throw new Error('Role inválida');
    }
  }
}
