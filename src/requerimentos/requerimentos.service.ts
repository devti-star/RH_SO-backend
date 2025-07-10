import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateRequerimentoDto } from "./dto/create-requerimento.dto";
import { UpdateRequerimentoDto } from "./dto/update-requerimento.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Requerimento } from "./entities/requerimento.entity";
import { Repository } from "typeorm";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { UsuarioNotFoundException } from "src/shared/exceptions/usuario-not-found.exception";
import { RequerimentoReponseDto } from "./dto/response-requerimento.dto";
import { Documento } from "src/documentos/entities/documento.entity";
import { RequerimentoNotFoundException } from "src/shared/exceptions/requerimento-not-found.exception";
import { ChangeStageRequerimentoDto } from "./dto/change-stage-requerimento.dto";
import { HistoricosService } from "src/historicos/historicos.service";

@Injectable()
export class RequerimentosService {
  constructor(
    @InjectRepository(Requerimento)
    private readonly repositorioRequerimento: Repository<Requerimento>,

    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,

    @Inject(forwardRef(() => HistoricosService))
    private readonly historicoService: HistoricosService
  ) {}

  async create(createRequerimentoDto: CreateRequerimentoDto) {
    const usuario = await this.usuarioService.findOne(
      createRequerimentoDto.usuarioId
    );

    if (!usuario)
      throw new UsuarioNotFoundException(createRequerimentoDto.usuarioId);

    const novoRequerimento = this.repositorioRequerimento.create({
      ...createRequerimentoDto,
      usuario: usuario,
    });

    const requerimentoSalvo =
      await this.repositorioRequerimento.save(novoRequerimento);
    return new RequerimentoReponseDto(novoRequerimento);
  }

  async findAll() {
    const requerimentos: Requerimento[] =
      await this.repositorioRequerimento.find({
        relations: {
          usuario: {
            rg: true,
          },
          documentos: true,
        },
      });

    return requerimentos;
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

  async update(id: number, updateRequerimentoDto: UpdateRequerimentoDto) {
    await this.findOne(id);
    await this.repositorioRequerimento.update(id, updateRequerimentoDto);
    return this.findOne(id);
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
    changeStageRequerimentoDto: ChangeStageRequerimentoDto
  ) {
    await this.historicoService.create({
      requerimentoId,
      funcionarioId,
      etapaAtual: changeStageRequerimentoDto.etapaAtual,
      etapaDestino: changeStageRequerimentoDto.etapaDestino,
      observacao: changeStageRequerimentoDto.observacao,
    });
    return this.update(requerimentoId, {
      etapa: changeStageRequerimentoDto.etapaDestino,
    });
  }
}
