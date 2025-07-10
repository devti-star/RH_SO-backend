
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RequerimentosService } from './requerimentos.service';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';


@UseGuards(RolesGuard)
@Controller('requerimentos')
export class RequerimentosController {
  constructor(private readonly requerimentosService: RequerimentosService) {}
  
  @Get()
  @Roles(Role.ADMIN, Role.ENFERMEIRO, Role.MEDICO, Role.PS, Role.RH, Role.TRIAGEM)
  findAll() {
    return this.requerimentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.requerimentosService.findOne(id);
  }


  @Get('usuario/:id')
@Roles(Role.ADMIN, Role.ENFERMEIRO, Role.MEDICO, Role.PS, Role.RH, Role.TRIAGEM, Role.PADRAO)
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
