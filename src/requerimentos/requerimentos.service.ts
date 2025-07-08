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

        const requerimentoSalvo = await this.repositorioRequerimento.save(novoRequerimento); 
      return new RequerimentoReponseDto(novoRequerimento);
  }

  async findAll() {
    const requerimentos: Requerimento[] = await this.repositorioRequerimento.find({
      relations: {
        usuario: {
          rg: true,
        }
      },
    });
    return requerimentos;
  }

  async findAllRequerimentsUser(idUsuario: number){
    const requerimentos: Requerimento[] = await this.repositorioRequerimento.find({
      relations: {
        usuario: {
          rg: true,
        }
      },
      where: {usuario: {id: idUsuario}}
    });
    return requerimentos;
  }

  async findOne(id: number) {
    const requerimento = await this.repositorioRequerimento.findOne({
      where: { id },
      relations: {
        usuario: {
          rg: true,
        }
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

  async remove(id: number) {
    await this.findOne(id);
    const removeRequerimento = await this.repositorioRequerimento.delete(id);

    if(!removeRequerimento.affected){
      throw new RequerimentoNotFoundException(id); 
    }

    return true;
  }
}
