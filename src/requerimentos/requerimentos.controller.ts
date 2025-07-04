import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RequerimentosService } from './requerimentos.service';
import { CreateRequerimentoDto } from './dto/create-requerimento.dto';
import { UpdateRequerimentoDto } from './dto/update-requerimento.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(RolesGuard)
@Controller('requerimentos')
export class RequerimentosController {
  constructor(private readonly requerimentosService: RequerimentosService) {}

  @Post()
  create(@Body() createRequerimentoDto: CreateRequerimentoDto) {
    return this.requerimentosService.create(createRequerimentoDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.ENFERMEIRO, Role.MEDICO, Role.PS, Role.RH, Role.TRIAGEM)
  findAll() {
    return this.requerimentosService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.ENFERMEIRO, Role.MEDICO, Role.PS, Role.RH, Role.TRIAGEM, Role.PADRAO)
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
