import { Injectable } from '@nestjs/common';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Requerimento } from './entities/requerimento.entity';
import { Repository } from 'typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioNotFoundException } from 'src/shared/exceptions/usuario-not-found.exception';

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

    const novoRequerimento = this.repositorioRequerimento.create(createRequerimentoDto);
    return this.repositorioRequerimento.save(novoRequerimento); 
  }

  findAll() {
    return `This action returns all requerimentos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requerimento`;
  }

  update(id: number, updateRequerimentoDto: UpdateRequerimentoDto) {
    return `This action updates a #${id} requerimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} requerimento`;
  }
}
