import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AtestadosService } from './atestados.service';
import { CreateAtestadoDto } from './dto/create-atestado.dto';
import { UpdateAtestadoDto } from './dto/update-atestado.dto';

@Controller('atestados')
export class AtestadosController {
  constructor(private readonly atestadosService: AtestadosService) {}

  @Post()
  create(@Body() createAtestadoDto: CreateAtestadoDto) {
    return this.atestadosService.create(createAtestadoDto);
  }

  @Get()
  findAll() {
    return this.atestadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atestadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAtestadoDto: UpdateAtestadoDto) {
    return this.atestadosService.update(+id, updateAtestadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atestadosService.remove(+id);
  }
}
