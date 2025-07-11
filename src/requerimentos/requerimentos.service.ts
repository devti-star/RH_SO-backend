import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Requerimento } from './entities/requerimento.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioNotFoundException } from 'src/shared/exceptions/usuario-not-found.exception';
import { RequerimentoReponseDto } from './dto/response-requerimento.dto';
import { Atestado, Documento } from 'src/documentos/entities/documento.entity';
import { RequerimentoNotFoundException } from 'src/shared/exceptions/requerimento-not-found.exception';

@Injectable()
export class RequerimentosService {
  constructor(
    @InjectRepository(Requerimento)
    private readonly repositorioRequerimento: Repository<Requerimento>,

    @InjectRepository(Atestado)
    private readonly atestadoRepository: Repository<Atestado>,

    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,

    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,
  ) {}

  async create(createRequerimentoDto: CreateRequerimentoDto) {
    const usuario = await this.usuarioService.findOne(createRequerimentoDto.usuarioId);
    if (!usuario)
      throw new UsuarioNotFoundException(createRequerimentoDto.usuarioId);

    const novoRequerimento = this.repositorioRequerimento.create({
      ...createRequerimentoDto,
      usuario: usuario
    });

    const requerimentoSalvo = await this.repositorioRequerimento.save(novoRequerimento);
    return new RequerimentoReponseDto(novoRequerimento);
  }

  async findAll() {
    const requerimentos = await this.repositorioRequerimento.find({
      relations: ['usuario', 'documentos', 'historico'],
    });

    // Para cada requerimento, inclua só o último histórico no retorno
    return requerimentos.map(req => ({
      ...req,
      historico: req.historico?.sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())[0]
    }));
  }

  async findAllRequerimentsUser(idUsuario: number) {
    const requerimentos: Requerimento[] = await this.repositorioRequerimento.find({
      relations: {
        usuario: {
          rg: true,
        },
        documentos: true,
      },
      where: {
        usuario: {
          id: idUsuario,
        },
      },
    });

    return requerimentos;
  }

  async findOne(id: number) {
    const requerimento = await this.repositorioRequerimento.findOne({
      where: { id },
      relations: {
        usuario: {
          rg: true,
        },
        documentos: true,
      },
    });

    if (!requerimento)
      throw new RequerimentoNotFoundException(id);

    return requerimento;
  }

  /**
   * Update robusto para documentos herdados (Atestado)
   * Faz update pelo repositório pai (Documento) para garantir update do campo checklist
   */
  async update(id: number, updateRequerimentoDto: UpdateRequerimentoDto) {
    // Atualiza documentos (Atestados), se vieram no DTO
    if (updateRequerimentoDto.documentos) {
    for (const doc of updateRequerimentoDto.documentos) {
      const updateDoc: any = {};
      if (doc.justificativa !== undefined) updateDoc.justificativa = doc.justificativa;
      if (doc.checklist !== undefined) updateDoc.checklist = doc.checklist;
      if (doc.concluido !== undefined) updateDoc.concluido = doc.concluido;   // <--- ESSA LINHA É FUNDAMENTAL!

      if (Object.keys(updateDoc).length === 0) continue;

      await this.documentoRepository.createQueryBuilder()
        .update()
        .set(updateDoc)
        .where("id = :id", { id: doc.id })
        .execute();
    }
    delete updateRequerimentoDto.documentos;
  }

    // Filtra apenas os campos realmente alterados em relação ao banco
    const reqAtual = await this.repositorioRequerimento.findOneBy({ id });
    if (!reqAtual) {
      throw new Error(`Requerimento com id ${id} não encontrado para update.`);
    }

    const camposAlterados: any = {};
    for (const [chave, valor] of Object.entries(updateRequerimentoDto)) {
      if (
        valor !== undefined &&
        valor !== null &&
        reqAtual[chave] !== valor
      ) {
        camposAlterados[chave] = valor;
      }
    }

    if (Object.keys(camposAlterados).length > 0) {
      await this.repositorioRequerimento.update(id, camposAlterados);
    }

    // Retorna objeto atualizado com relations
    return this.repositorioRequerimento.findOne({
      where: { id },
      relations: ['usuario', 'documentos', 'historico'],
    });
  }
 



  async remove(id: number) {
    await this.findOne(id);
    const removeRequerimento = await this.repositorioRequerimento.delete(id);

    if (!removeRequerimento.affected) {
      throw new RequerimentoNotFoundException(id);
    }

    return true;
  }
}
