import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { FileStorageService } from '../shared/services/file-storage.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
    @InjectRepository(Medico)
    private readonly repositorioMedico: Repository<Medico>,
    @InjectRepository(Enfermeiro)
    private readonly repositorioEnfermeiro: Repository<Enfermeiro>,
    private readonly fileStorage: FileStorageService,
  ) {}

  async activateUser(userId: number): Promise<void> {
    await this.repositorioUsuario.update(userId, {
      isActive: true,
      activatedAt: new Date(),
    });
  }

  async activateByToken(token: string): Promise<Usuario> {
    const usuario = await this.repositorioUsuario.findOne({ 
      where: { activationToken: token } 
    });
    
    if (!usuario) {
      throw new NotFoundException('Token de ativação inválido');
    }
    
    await this.activateUser(usuario.id);
    return usuario;
  }

  async criar(createUsuarioDto: CreateUsuarioDto) {
    try {
      const novoUsuario = this.criaUsuarioPorRole(createUsuarioDto);
      novoUsuario.activationToken = crypto.randomBytes(32).toString('hex');
      novoUsuario.isActive = false;

      const usuarioSalvo = await this.salvaUsuarioPorRole(novoUsuario);
      return usuarioSalvo;
    } catch (error) {
      throw new BadRequestException(error.message || 'Erro ao criar usuário.');
    }
  }


  findAll() {
    return `This action returns all usuarios`;
  }

  async findOne(
    id: number,
    campos: (keyof UsuarioResponseDto)[] = []
  ): Promise<Partial<UsuarioResponseDto>> {

    const usuario = await this.repositorioUsuario.findOne({
      where: { id },
      select: campos.length > 0 ? campos : undefined,
      relations: campos.includes("rg") ? { rg: true } : { rg: false},
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }
    const usuarioResponse: UsuarioResponseDto = new UsuarioResponseDto(usuario);
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
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
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

    // Atualização de senha exige senha atual
    if (updateUsuarioDto.senha !== undefined) {
      if (!updateUsuarioDto.senhaAtual) {
        throw new BadRequestException(
          "É necessário informar a senha atual para alterar a senha."
        );
      }
      if (usuario.senha) {
        // Compara senha informada com hash salvo
        const senhaConfere = compareSync(
          updateUsuarioDto.senhaAtual,
          usuario.senha
        );
        if (!senhaConfere) {
          throw new BadRequestException("Senha atual incorreta.");
        }
        usuario.senha = hashSync(updateUsuarioDto.senha, 10);
      }
    }

    await this.repositorioUsuario.save(usuario);
    const usuarioResponse: UsuarioResponseDto = new UsuarioResponseDto(usuario);
    return usuarioResponse;
  }

  async salvarFoto(userId: number, file: Express.Multer.File) {
    const usuario = await this.repositorioUsuario.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${userId} não encontrado.`);
    }

    if (!file.mimetype.startsWith('image/')) {
      await fs.promises.unlink(file.path).catch(() => {});
      throw new BadRequestException('Arquivo enviado não é uma imagem válida.');
    }

    const extensao = path.extname(file.originalname);
    const nomeFotoFinal = `${userId}_profile${extensao}`;
    const pasta = './fotosUsuario';

    if (usuario.foto) {
      const caminhoAntigo = path.join(pasta, usuario.foto);
      await fs.promises.unlink(caminhoAntigo).catch(() => {});
    }

    const buffer = await fs.promises.readFile(file.path);
    await this.fileStorage.saveFile(pasta, nomeFotoFinal, buffer);
    await fs.promises.unlink(file.path).catch(() => {});

    usuario.foto = nomeFotoFinal;
    await this.repositorioUsuario.save(usuario);

    return { message: 'Foto salva com sucesso.', foto: nomeFotoFinal };
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

    // Mantém seu método de criação por role (pode ser igual ao que você já tem):
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
        throw new Error('Role inválida');
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

  getColumnsforUser(usuario: Usuario, id: number): (keyof UsuarioResponseDto)[] {
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
    ] as (keyof UsuarioResponseDto)[];

    // console.log("Usuario.id = ", usuario.id, "\nreq.id = ", id);

    if (usuario.role !== Role.PADRAO) {
      if (usuario.role === Role.ADMIN || usuario.role === Role.MEDICO) return campos;
        
      if (usuario.id !== id) return campos.filter((campo) => campo !== "cpf" && campo !== "rg");

      return campos;
    }

    if (usuario.id !== id)
      throw new HttpException(`Acesso não autorizado`, HttpStatus.FORBIDDEN);

    return campos;
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
