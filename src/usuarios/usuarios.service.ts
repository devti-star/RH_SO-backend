import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { UsuarioResponseDto } from "./dto/usuario-response.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario, Medico, Enfermeiro } from "./entities/usuario.entity";
import { Role } from "src/enums/role.enum";
import { compareSync, hashSync } from "bcrypt";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { RequerimentosService } from "src/requerimentos/requerimentos.service";
import { UsuarioNotFoundException } from "src/shared/exceptions/usuario-not-found.exception";
import { Usuariofactory } from "src/shared/factory/usuario-factory";
import { EnfermeiroResponseDto } from "./dto/enfermeiro-response.dto";
import { MedicoResponseDto } from "./dto/medico-response.dto";
import { UsuarioResponseFactory } from "src/shared/factory/usuario-response-factory";

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
    @InjectRepository(Medico)
    private readonly repositorioMedico: Repository<Medico>,
    @InjectRepository(Enfermeiro)
    private readonly repositorioEnfermeiro: Repository<Enfermeiro>,
    @Inject(forwardRef(() => RequerimentosService))
    private readonly requerimentosService: RequerimentosService
  ) {}

  async activateUser(userId: number): Promise<void> {
    await this.repositorioUsuario.update(userId, {
      isActive: true,
      activatedAt: new Date(),
    });
  }

  async activateByToken(id: number): Promise<Usuario> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id: id },
    });

    if (!usuario) {
      throw new NotFoundException("Token de ativação inválido");
    }

    await this.activateUser(usuario.id);
    return usuario;
  }

  async criar(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const novoUsuario = this.criaUsuarioPorRole(createUsuarioDto);
      novoUsuario.isActive = false;
      novoUsuario.foto = null;
      return await this.salvaUsuarioPorRole(novoUsuario);
    } catch (error) {
      throw new BadRequestException(error.message || "Erro ao criar usuário.");
    }
  }

  async atualizarFoto(id: number, filename: string) {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rg: true }, // carrega o RG vinculado!
    });
    if (!usuario) throw new NotFoundException("Usuário não encontrado!");
    if (usuario.foto && usuario.foto !== filename) {
      const oldPath = path.join("./fotosUsuario", usuario.foto);
      fs.promises.unlink(oldPath).catch(() => {});
    }
    usuario.foto = filename;
    await this.repositorioUsuario.save(usuario);
    return usuario;
  }

  async findAll() {
    const usuarios = await this.repositorioUsuario.find({
      relations: {
        rg: true,
      },
    });

    return usuarios;
  }

  async findAllRequerimentsOfUser(idUser: number) {
    const usuario = await this.findOne(idUser);

    if (!usuario) throw new UsuarioNotFoundException(idUser);

    const meusRequerimentos =
      await this.requerimentosService.findAllRequerimentsUser(idUser);
    return meusRequerimentos;
  }

  async findOne(
    id: number,
    campos: (keyof UsuarioResponseDto)[] = [],
    role: Role = Role.PADRAO,
  ): Promise<UsuarioResponseDto | EnfermeiroResponseDto | MedicoResponseDto > {
    let repositorio: Repository<Usuario> = this.repositorioUsuario;
    switch (role) {
      case Role.MEDICO:
        console.log("aqui");
        repositorio = this.repositorioMedico;
        break;
      case Role.ENFERMEIRO:
        repositorio = this.repositorioEnfermeiro;
        break;
      case Role.PADRAO:
      case Role.RH:
      case Role.PS:
      case Role.ADMIN:
      case Role.TRIAGEM:
        repositorio = this.repositorioUsuario;
        break;
      default:
        throw new BadRequestException("Role inválida");
    }
    const usuario = await repositorio.findOne({
      where: { id },
      select: campos.length > 0 ? campos : undefined,
      relations: campos.includes("rg") ? { rg: true } : { rg: false },
    });
    // console.log("findOne usuario", usuario);
    if (!usuario) {
      throw new UsuarioNotFoundException(id);
    }
    const usuarioResponse: UsuarioResponseDto | EnfermeiroResponseDto | MedicoResponseDto = UsuarioResponseFactory.createResponse(usuario, role);
    return usuarioResponse;
  }

  async findByEmail(
    email: string,
    incluirSenha: boolean = false
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.repositorioUsuario
      .createQueryBuilder("usuario")
      .addSelect("usuario.senha")
      .where("usuario.email = :email", { email })
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
    }
    const usuarioResponse: UsuarioResponseDto = new UsuarioResponseDto(usuario);
    return usuarioResponse;
  }

  async findByEmailcomSenha(email: string): Promise<Usuario> {
    const usuario = await this.repositorioUsuario
      .createQueryBuilder("usuario")
      .addSelect("usuario.senha")
      .where("usuario.email = :email", { email })
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado.`);
    }

    return usuario;
  }

  // ...restante do código

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      relations: { rg: true },
      select: [
        "id",
        "nomeCompleto",
        "departamento",
        "secretaria",
        "telefone",
        "cargo",
        "senha",
        "foto",
        "email",
        "cpf",
        "matricula",
        "role",
      ],
    });

    if (!usuario) {
      throw new UsuarioNotFoundException(id);
    }

    // Atualiza apenas campos permitidos
    if (updateUsuarioDto.nomeCompleto !== undefined)
      usuario.nomeCompleto = updateUsuarioDto.nomeCompleto;
    if (updateUsuarioDto.departamento !== undefined)
      usuario.departamento = updateUsuarioDto.departamento;
    if (updateUsuarioDto.secretaria !== undefined)
      usuario.secretaria = updateUsuarioDto.secretaria;
    if (updateUsuarioDto.telefone !== undefined)
      usuario.telefone = updateUsuarioDto.telefone;
    if (updateUsuarioDto.cargo !== undefined)
      usuario.cargo = updateUsuarioDto.cargo;
    if (updateUsuarioDto.foto !== undefined)
      usuario.foto = updateUsuarioDto.foto;
    if (updateUsuarioDto.isActive !== undefined)
      usuario.isActive = updateUsuarioDto.isActive;
    if (updateUsuarioDto.activatedAt !== undefined)
      usuario.activatedAt = updateUsuarioDto.activatedAt;
    if (updateUsuarioDto.senha)
      usuario.senha = hashSync(updateUsuarioDto.senha, 10);

    await this.repositorioUsuario.save(usuario);
    const usuarioResponse: UsuarioResponseDto = new UsuarioResponseDto(usuario);
    return usuarioResponse;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  // Mantém seu método de criação por role (pode ser igual ao que você já tem):
  private criaUsuarioPorRole(criaUsuarioDto: CreateUsuarioDto): Usuario {
    const usuario = Usuariofactory.createUsuario(criaUsuarioDto);
    return usuario;
  }

  getColumnsforUser(
    usuario: Usuario,
    id: number
  ): (keyof UsuarioResponseDto)[] {
    const campos = [
      "id",
      "nomeCompleto",
      "cpf",
      "rg",
      "email",
      "matricula",
      "secretaria",
      "departamento",
      "telefone",
      "cargo",
      "foto"
    ] as (keyof UsuarioResponseDto)[];

    if (usuario.role !== Role.PADRAO) {
      if (usuario.role === Role.ADMIN || usuario.role === Role.MEDICO)
        return campos;

      if (usuario.id !== id)
        return campos.filter((campo) => campo !== "cpf" && campo !== "rg");

      return campos;
    }

    // if (usuario.id !== id)
    //   throw new HttpException(`Acesso não autorizado`, HttpStatus.FORBIDDEN);

    return campos;
  }

  private async salvaUsuarioPorRole(usuario: Usuario): Promise<Usuario> {
    switch (usuario.role) {
      case Role.PADRAO:
      case Role.RH:
      case Role.PS:
      case Role.ADMIN:
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

  // async findByEmail(
  //   email: string,
  //   includePassword: boolean = false,
  //   role: Role
  // ): Promise<Usuario | Enfermeiro | Medico | null> {
  //   let usuario: Usuario | Enfermeiro | Medico | null = null;

  //   switch (role) {
  //     case Role.PADRAO:
  //       usuario = await this.repositorioUsuario
  //         .createQueryBuilder("usuario")
  //         .addSelect(includePassword ? "usuario.senha" : "")
  //         .where("usuario.email = :email", { email })
  //         .getOne();
  //       break;
  //     case Role.MEDICO:
  //       usuario = await this.repositorioMedico
  //         .createQueryBuilder("medico")
  //         .addSelect(includePassword ? "medico.senha" : "")
  //         .where("medico.email = :email", { email })
  //         .getOne();
  //       break;
  //     case Role.ENFERMEIRO:
  //       usuario = await this.repositorioEnfermeiro
  //         .createQueryBuilder("enfermeiro")
  //         .addSelect(includePassword ? "enfermeiro.senha" : "")
  //         .where("enfermeiro.email = :email", { email })
  //         .getOne();
  //       break;
  //   }

  //   if (!usuario) {
  //     return null;
  //   }

  //   if (includePassword) {
  //     return usuario;
  //   } else {
  //     const { senha, ...resultado } = usuario;
  //     return resultado as Usuario;
  //   }
  // }
}
