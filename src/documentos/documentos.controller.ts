import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseIntPipe,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DocumentosService } from './documentos.service';
import { Documento } from './entities/documento.entity';
import { CreateAtestadoDto } from './dto/create-atestado.dto';
import { UpdateRequerimentoDto } from 'src/requerimentos/dto/update-requerimento.dto';

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOne(id);
  }

  @Post('/atestados')
  create(@Body() createAtestadoDto: CreateAtestadoDto){
    return this.documentosService.createAtestado(createAtestadoDto);
  }

  // Faz a substituição do documento caso ja exista
  @Post('substituir/:requerimentoId')
  @UseInterceptors(FileInterceptor('arquivo', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async substituirArquivo(
    @UploadedFile() file: Express.Multer.File,
    @Param('requerimentoId', ParseIntPipe) requerimentoId: number,
    @Body() updateRequerimentoDto: UpdateRequerimentoDto,
  ): Promise<Documento> {
    return this.documentosService.substituirArquivoDocumento(requerimentoId, file, updateRequerimentoDto);
  }
}
