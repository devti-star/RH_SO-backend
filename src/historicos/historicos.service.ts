import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateHistoricoDto } from "./dto/create-historico.dto";
import { UpdateHistoricoDto } from "./dto/update-historico.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Historico } from "./entities/historico.entity";
import { Repository } from "typeorm";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { UsuarioNotFoundException } from "src/shared/exceptions/usuario-not-found.exception";
import { RequerimentosService } from "src/requerimentos/requerimentos.service";
import { RequerimentoNotFoundException } from "src/shared/exceptions/requerimento-not-found.exception";
import { HistoricoNotFoundException } from "src/shared/exceptions/historico-not-found.exception";
@Injectable()
export class HistoricosService {
  constructor(
    @InjectRepository(Historico)
    private readonly repositorioHistorico: Repository<Historico>,
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuarioService: UsuariosService,
    @Inject() private readonly requerimentosService: RequerimentosService
  ) {}

  async create(createHistoricoDto: CreateHistoricoDto) {
    const usuario = await this.usuarioService.findOne(
      createHistoricoDto.funcionarioId
    );
    const requerimento = await this.requerimentosService.findOne(
      createHistoricoDto.requerimentoId
    );

    if (!usuario)
      throw new UsuarioNotFoundException(createHistoricoDto.funcionarioId);

    if (!requerimento)
      throw new RequerimentoNotFoundException(
        createHistoricoDto.requerimentoId
      );

    const novoRegistro = this.repositorioHistorico.create({
      ...createHistoricoDto,
      funcionario: usuario,
      requerimento: requerimento,
    });

    await this.repositorioHistorico.save(novoRegistro);

    return { message: "Registro salvo com sucesso!" };
  }

  async findLastRecord(idRequerimento: number) {
    const lastRecord = await this.repositorioHistorico.findOne({
      where: { requerimento: { id: idRequerimento } },
      order: {dataRegistro: "DESC"}
    });

    if (!lastRecord) throw new HistoricoNotFoundException(idRequerimento);

    return lastRecord;
  }

  findAll() {
    return `This action returns all historicos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historico`;
  }

  update(id: number, updateHistoricoDto: UpdateHistoricoDto) {
    return `This action updates a #${id} historico`;
  }

  remove(id: number) {
    return `This action removes a #${id} historico`;
  }
}
