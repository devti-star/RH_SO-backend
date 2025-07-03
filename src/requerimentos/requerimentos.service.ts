import { Injectable } from '@nestjs/common';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Requerimento } from './entities/requerimento.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioNotFoundException } from 'src/shared/exceptions/usuario-not-found.exception';
import { RequerimentoReponseDto } from './dto/response-requerimento.dto';
import { Documento } from 'src/documentos/entities/documento.entity';
import { RequerimentoNotFoundException } from 'src/shared/exceptions/requerimento-not-found.exception';

@Injectable()
export class RequerimentosService {
  constructor(
    @InjectRepository(Requerimento)
    private readonly repositorioRequerimento: Repository<Requerimento>,

    private readonly usuarioService: UsuariosService
  ){}

  async create(createRequerimentoDto: CreateRequerimentoDto) {
      const usuario = await this.usuarioService.findOne(createRequerimentoDto.usuarioId)

      if(!usuario)
        throw new UsuarioNotFoundException(createRequerimentoDto.usuarioId);

      const novoRequerimento = this.repositorioRequerimento.create({
        ...createRequerimentoDto,
        usuario: usuario});

        this.repositorioRequerimento.save(novoRequerimento); 
      return new RequerimentoReponseDto(novoRequerimento);
  }

  async findAll() {
    const requerimentos: Requerimento[] = await this.repositorioRequerimento.find({
      relations: {usuario: true}
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
      },
    });

    if(!requerimento)
      throw new RequerimentoNotFoundException(id);

    return requerimento;
  }

  async update(id: number, updateRequerimentoDto: UpdateRequerimentoDto) {
    await this.findOne(id);
    await this.repositorioRequerimento.update(id, updateRequerimentoDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} requerimento`;
  }
}
