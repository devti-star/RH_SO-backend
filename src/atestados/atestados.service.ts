import { Injectable } from '@nestjs/common';
import { CreateAtestadoDto } from './dto/create-atestado.dto';
import { UpdateAtestadoDto } from './dto/update-atestado.dto';

@Injectable()
export class AtestadosService {
  create(createAtestadoDto: CreateAtestadoDto) {
    return 'This action adds a new atestado';
  }

  findAll() {
    return `This action returns all atestados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atestado`;
  }

  update(id: number, updateAtestadoDto: UpdateAtestadoDto) {
    return `This action updates a #${id} atestado`;
  }

  remove(id: number) {
    return `This action removes a #${id} atestado`;
  }
}
