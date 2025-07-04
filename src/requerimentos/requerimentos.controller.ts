import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe } from '@nestjs/common';
import { RequerimentosService } from './requerimentos.service';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';

@Controller('requerimentos')
export class RequerimentosController {
  constructor(private readonly requerimentosService: RequerimentosService) {}
  
  @Get()
  findAll() {
    return this.requerimentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.requerimentosService.findOne(id);
  }

  findAllforId(@Param('id', ParseIntPipe) id: number){
    return this.requerimentosService.findAllRequerimentsUser(id);
  }

  @HttpCode(201)
  @Post()
  create(@Body() createRequerimentoDto: CreateRequerimentoDto) {
    return this.requerimentosService.create(createRequerimentoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequerimentoDto: UpdateRequerimentoDto) {
    return this.requerimentosService.update(+id, updateRequerimentoDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.requerimentosService.remove(id);
  }
}
