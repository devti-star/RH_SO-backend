import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { RequerimentosService } from "./requerimentos.service";
import { UpdateRequerimentoDto } from "./dto/update-requerimento.dto";
import { CreateRequerimentoDto } from "./dto/create-requerimento.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { HistoricosService } from "src/historicos/historicos.service";
import { ChangeStageRequerimentoDto } from "./dto/change-stage-requerimento.dto";

@UseGuards(RolesGuard)
@Controller("requerimentos")
export class RequerimentosController {
  constructor(private readonly requerimentosService: RequerimentosService) {}

  @Get()
  @Roles(
    Role.ADMIN,
    Role.ENFERMEIRO,
    Role.MEDICO,
    Role.PS,
    Role.RH,
    Role.TRIAGEM
  )
  findAll() {
    return this.requerimentosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.requerimentosService.findOne(id);
  }

  findAllforId(@Param("id", ParseIntPipe) id: number) {
    return this.requerimentosService.findAllRequerimentsUser(id);
  }

  @HttpCode(201)
  @Post()
  create(@Body() createRequerimentoDto: CreateRequerimentoDto) {
    return this.requerimentosService.create(createRequerimentoDto);
  }

  @Patch("mudar-etapa/:idRequerimento")
  async changeStage(
    @Param("idRequerimento", ParseIntPipe) idRequerimento: number,
    @Body() changeStageRequerimentoDto: ChangeStageRequerimentoDto,
    @CurrentUser() user: Usuario
  ) {
    return this.requerimentosService.changeStage(
      idRequerimento,
      user.id,
      changeStageRequerimentoDto
    );
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateRequerimentoDto: UpdateRequerimentoDto
  ) {
    return this.requerimentosService.update(+id, updateRequerimentoDto);
  }

  @HttpCode(204)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.requerimentosService.remove(id);
  }
}
