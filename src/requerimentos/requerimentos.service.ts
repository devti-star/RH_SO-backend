import { Injectable } from '@nestjs/common';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';

@Injectable()
export class RequerimentosService {
  create(createRequerimentoDto: CreateRequerimentoDto) {
    return 'This action adds a new requerimento';
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
