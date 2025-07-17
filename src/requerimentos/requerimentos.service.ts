import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateRequerimentoDto } from "./dto/create-requerimento.dto";
import {
  UpdateRequerimentoDto,
  DocumentoJustificativaDto,
} from "./dto/update-requerimento.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Requerimento } from "./entities/requerimento.entity";
import { Repository } from "typeorm";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { UsuarioNotFoundException } from "src/shared/exceptions/usuario-not-found.exception";
import { RequerimentoReponseDto } from "./dto/response-requerimento.dto";
import { Atestado, Documento } from "src/documentos/entities/documento.entity";
import { RequerimentoNotFoundException } from "src/shared/exceptions/requerimento-not-found.exception";
import { ChangeStageRequerimentoDto } from "./dto/change-stage-requerimento.dto";
import { HistoricosService } from "src/historicos/historicos.service";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { MailService } from "src/mail/mail.service";
import { Status } from "src/enums/status.enum";
import { Etapa } from "src/enums/etapa.enum";


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

    @Inject(forwardRef(() => HistoricosService))
    private readonly historicoService: HistoricosService,

    @Inject (forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  async create(createRequerimentoDto: CreateRequerimentoDto) {
    const usuario = await this.usuarioService.findOne(
      createRequerimentoDto.usuarioId
    );

    if (!usuario)
      throw new UsuarioNotFoundException(createRequerimentoDto.usuarioId);

    const novoRequerimento = await this.repositorioRequerimento.create({
      ...createRequerimentoDto,
      usuario: usuario,
    });

    
    const requerimentoSalvo = await this.repositorioRequerimento.save(novoRequerimento);

    const novoHistorico = await this.historicoService.create({
      requerimentoId: requerimentoSalvo.id,
      funcionarioId: usuario.id,
      etapaAtual: requerimentoSalvo.etapa,
      etapaDestino: requerimentoSalvo.etapa,
      observacao: requerimentoSalvo.observacao,
    });

    return new RequerimentoReponseDto(novoRequerimento);
  }

  async findAll() {
    const requerimentos = await this.repositorioRequerimento.find({
      relations: ["usuario", "documentos", "historico"],
    });

    // Para cada requerimento, inclua só o último histórico no retorno
    return requerimentos.map((req) => ({
      ...req,
      historico: req.historico?.sort(
        (a, b) =>
          new Date(b.dataRegistro).getTime() -
          new Date(a.dataRegistro).getTime()
      )[0],
    }));
  }

  async findAllRequerimentsUser(idUsuario: number) {
    const requerimentos: Requerimento[] =
      await this.repositorioRequerimento.find({
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

    if (!requerimento) throw new RequerimentoNotFoundException(id);

    return requerimento;
  }

  async update(
    id: number, 
    updateRequerimentoDto: UpdateRequerimentoDto,
    usuario: Usuario
  ) {
    
    let docOld: Atestado | undefined | null = undefined;
    if (updateRequerimentoDto?.documentos?.[0] !== undefined){
      docOld = await this.atestadoRepository.findOne({ where: { id: updateRequerimentoDto.documentos[0].id } });
    }

    // Atualiza documentos (Atestados), se vieram no DTO
    const updateDoc: any = {};
    if (updateRequerimentoDto.documentos) {
      for (const doc of updateRequerimentoDto.documentos as DocumentoJustificativaDto[]) {
        if (doc.justificativa !== undefined) updateDoc.justificativa = doc.justificativa;
        if (doc.checklist !== undefined) updateDoc.checklist = doc.checklist;
        if (doc.concluido !== undefined) updateDoc.concluido = doc.concluido; // <--- ESSA LINHA É FUNDAMENTAL!
        if (doc.maior3dias !== undefined) updateDoc.maior3dias = doc.maior3dias;
        if (doc.qtdDias !== undefined) updateDoc.qtdDias = doc.qtdDias;

        if (Object.keys(updateDoc).length === 0) continue;
        await this.atestadoRepository
          .createQueryBuilder()
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

    const usuarioAtual = await this.usuarioService.findOne(reqAtual.usuario.id);
    if (!usuarioAtual) {
      throw new UsuarioNotFoundException(reqAtual.usuario.id);
    }

    if ( updateRequerimentoDto.etapa && updateRequerimentoDto.etapa !== reqAtual.etapa) {
      await this.mailService.sendChangeStateEmail(
        usuarioAtual,
        reqAtual.etapa,
        updateRequerimentoDto.etapa,
        reqAtual.status
      )
    }
    else if (updateRequerimentoDto.status !== undefined && updateRequerimentoDto.status !== reqAtual.status) {
      await this.mailService.sendChangeStateEmail(
        usuarioAtual,
        reqAtual.etapa,
        reqAtual.etapa,
        updateRequerimentoDto.status,
        false
      )
    }
    if(updateRequerimentoDto.status === Status.EM_PROCESSO && updateRequerimentoDto.etapa === Etapa.MEDICO && updateDoc.maior3dias === true) {
      await this.mailService.sendPresentialExameEmail(usuarioAtual);
    }

    const camposAlterados: any = {};
    for (const [chave, valor] of Object.entries(updateRequerimentoDto)) {
      if (valor !== undefined && valor !== null && reqAtual[chave] !== valor) {
        camposAlterados[chave] = valor;
      }
    }

    if (Object.keys(camposAlterados).length > 0) {
      await this.repositorioRequerimento.update(id, camposAlterados);
      await this.historicoService.create({
        requerimentoId: id,
        funcionarioId: usuario.id,
        etapaAtual: reqAtual.etapa,
        etapaDestino: updateRequerimentoDto.etapa ?? reqAtual.etapa,
        observacao: updateDoc.justificativa
      });
    }

    // Retorna objeto atualizado com relations
    return this.repositorioRequerimento.findOne({
      where: { id },
      relations: ["usuario", "documentos", "historico"],
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

  async changeStage(
    requerimentoId: number,
    funcionarioId: number,
    changeStageRequerimentoDto: ChangeStageRequerimentoDto,
    usuario: Usuario
  ) {
    await this.historicoService.create({
      requerimentoId,
      funcionarioId,
      etapaAtual: changeStageRequerimentoDto.etapaAtual,
      etapaDestino: changeStageRequerimentoDto.etapaDestino,
      observacao: changeStageRequerimentoDto.observacao,
    });
    return this.update(
      requerimentoId,
      {
        etapa: changeStageRequerimentoDto.etapaDestino,
      },
      usuario
    );
  }


  async updateObservacao(id: number, updateRequerimentoDto: UpdateRequerimentoDto) {
    const requerimento = await this.findOne(id);
    if (!requerimento) {
      throw new RequerimentoNotFoundException(id);
    }

    const reqAtual = await this.repositorioRequerimento.findOneBy({ id });
    if (!reqAtual) {
      throw new RequerimentoNotFoundException(id);
    }
    await this.historicoService.create({
        requerimentoId: id,
        funcionarioId: reqAtual.usuario.id,
        etapaAtual: reqAtual.etapa,
        etapaDestino: updateRequerimentoDto.etapa ?? reqAtual.etapa,
        observacao: updateRequerimentoDto.observacao,
      });

    return this.repositorioRequerimento.update(id, updateRequerimentoDto);

  }
}
