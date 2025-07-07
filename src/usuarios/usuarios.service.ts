import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Role } from "src/enums/role.enum";
import { compareSync, hashSync } from "bcrypt";

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

  async activateUser(userId: number): Promise<void> {
    await this.repositorioUsuario.update(userId, {
      isActive: true,
      activatedAt: new Date(),
    });
  }

  async activateByToken(id: number): Promise<Usuario> {
    const usuario = await this.repositorioUsuario.findOne({ 
      where: { id: id } 
    });
    
    if (!usuario) {
      throw new NotFoundException('Token de ativação inválido');
    }
    
    await this.activateUser(usuario.id);
    return usuario;
  }

  async criar(createUsuarioDto: CreateUsuarioDto): Promise<Usuario | Medico | Enfermeiro> {
    try {
      const novoUsuario = this.criaUsuarioPorRole(createUsuarioDto);
      
      // Gerar token de ativação
      novoUsuario.isActive = false;
      
      return await this.salvaUsuarioPorRole(novoUsuario);
    } catch (error) {
      throw new BadRequestException(error.message || "Erro ao criar usuário.");
    }
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  async findOne(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rg: true }, 
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    
    return this.entityToResponseDto(usuario);
  }

  private entityToResponseDto(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
      cpf: usuario.cpf,
      matricula: usuario.matricula,
      departamento: usuario.departamento,
      secretaria: usuario.secretaria,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      foto: usuario.foto,
      role: usuario.role,
      rgNumero: usuario.rg?.numeroRG,
      rgOrgaoExpeditor: usuario.rg?.orgãoExpeditor,
      crm: (usuario as any).crm, // Só vai existir em médico
      cre: (usuario as any).cre, // Só vai existir em enfermeiro
      isActive: usuario.isActive,
    } as UsuarioResponseDto;
  }


  async findByEmail(email: string, incluirSenha: boolean = false): Promise<UsuarioResponseDto> {
    const usuario = await this.repositorioUsuario
    .createQueryBuilder('usuario')
    .addSelect('usuario.senha')
    .where('usuario.email = :email', { email })
    .getOne()

    if (!usuario) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
    }

    if (incluirSenha){
      return usuario;
    } else {
      const { senha, ...resultado} = usuario;
      return resultado as UsuarioResponseDto;
    }
  }

  async findByEmailcomSenha(email: string): Promise<Usuario> {
    const usuario = await this.repositorioUsuario
    .createQueryBuilder('usuario')
    .addSelect('usuario.senha')
    .where('usuario.email = :email', { email })
    .getOne()
    
    if (!usuario) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rg: true },
      select: ['id', 'nomeCompleto', 'departamento', 'secretaria', 'telefone', 'cargo', 'senha', 'foto', 'email', 'cpf', 'matricula', 'role'] 
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }

    // Atualiza apenas campos permitidos
    if (updateUsuarioDto.nomeCompleto !== undefined) usuario.nomeCompleto = updateUsuarioDto.nomeCompleto;
    if (updateUsuarioDto.departamento !== undefined) usuario.departamento = updateUsuarioDto.departamento;
    if (updateUsuarioDto.secretaria !== undefined) usuario.secretaria = updateUsuarioDto.secretaria;
    if (updateUsuarioDto.telefone !== undefined) usuario.telefone = updateUsuarioDto.telefone;
    if (updateUsuarioDto.cargo !== undefined) usuario.cargo = updateUsuarioDto.cargo;
    if (updateUsuarioDto.foto !== undefined) usuario.foto = updateUsuarioDto.foto;

    // Atualização de senha exige senha atual
    if (updateUsuarioDto.senha !== undefined) {
      if (!updateUsuarioDto.senhaAtual) {
        throw new BadRequestException("É necessário informar a senha atual para alterar a senha.");
      }
      if (usuario.senha){
        // Compara senha informada com hash salvo
        const senhaConfere = compareSync(updateUsuarioDto.senhaAtual, usuario.senha);
        if (!senhaConfere) {
          throw new BadRequestException("Senha atual incorreta.");
        }
        usuario.senha = hashSync(updateUsuarioDto.senha, 10);
      }
    }

    await this.repositorioUsuario.save(usuario);
    return this.entityToResponseDto(usuario);
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
          criaUsuarioDto.telefone
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
          criaUsuarioDto.telefone
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
          criaUsuarioDto.telefone
        );

      default:
        throw new Error("Role inválida");
    }
  }

  private async salvaUsuarioPorRole(usuario: Usuario | Medico | Enfermeiro): Promise<Usuario | Medico | Enfermeiro> {
    switch (usuario.role) {
      case Role.PADRAO:
      case Role.TRIAGEM:
        return this.repositorioUsuario.save(usuario);
      case Role.MEDICO:
        return this.repositorioMedico.save(usuario);
      case Role.ENFERMEIRO:
        return this.repositorioEnfermeiro.save(usuario);
      default:
        throw new Error("Role inválida");
    }
  }
}