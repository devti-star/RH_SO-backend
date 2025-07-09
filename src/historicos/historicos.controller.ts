import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { HistoricosService } from "./historicos.service";
import { CreateHistoricoDto } from "./dto/create-historico.dto";
import { UpdateHistoricoDto } from "./dto/update-historico.dto";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("historicos")
export class HistoricosController {
  constructor(private readonly historicosService: HistoricosService) {}

  @Post()
  create(@Body() createHistoricoDto: CreateHistoricoDto) {
    return this.historicosService.create(createHistoricoDto);
  }

  @Get()
  findAll() {
    return this.historicosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.historicosService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateHistoricoDto: UpdateHistoricoDto
  ) {
    return this.historicosService.update(+id, updateHistoricoDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.historicosService.remove(+id);
  }

  @Get("last/:id")
  getLastRecord(@Param("id", ParseIntPipe) id: number) {
    return this.historicosService.findLastRecord(id);
  }
}
