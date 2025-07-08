import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentosService } from './documentos.service';
import { Documento } from './entities/documento.entity';
import { CreateAtestadoDto } from './dto/create-atestado.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // até 10 MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('requerimentoId', ParseIntPipe) requerimentoId: number,
  ): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Campo arquivo é obrigatório');
    }
    return this.documentosService.create(requerimentoId, file);
  }

  @Post('/atestados')
  create(@Body() createAtestadoDto: CreateAtestadoDto){
    return this.documentosService.createAtestado(createAtestadoDto);
  }
}
