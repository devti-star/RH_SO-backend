import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequerimentosService } from './requerimentos.service';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';

@Controller('requerimentos')
export class RequerimentosController {
  constructor(private readonly requerimentosService: RequerimentosService) {}

  @Post()
  create(@Body() createRequerimentoDto: CreateRequerimentoDto) {
    return this.requerimentosService.create(createRequerimentoDto);
  }

  @Get()
  findAll() {
    return this.requerimentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requerimentosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequerimentoDto: UpdateRequerimentoDto) {
    return this.requerimentosService.update(+id, updateRequerimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requerimentosService.remove(+id);
  }
}
