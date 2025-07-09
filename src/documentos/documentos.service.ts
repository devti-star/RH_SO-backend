// src/documentos/documentos.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Requerimento } from '../requerimentos/entities/requerimento.entity';
import { FileStorageService } from '../shared/services/file-storage.service';
import { CreateAtestadoDto } from './dto/create-atestado.dto';
import { DocumentNotFoundException } from 'src/shared/exceptions/document-not-found.exception';

@Injectable()
export class DocumentosService {
  private uploadDir = path.resolve(__dirname, '../../uploads');

  constructor(
    @InjectRepository(Documento)
    private readonly repositorioDocumento: Repository<Documento>,
    private readonly fileStorage: FileStorageService,
  ) {
  }

 async create(requerimentoId: number, file: Express.Multer.File): Promise<Documento> {
  if (!file) {
    throw new BadRequestException('Arquivo não enviado');
  }

  // Caso a pasta 'uploads' nao exista, é feito a criação aqui
  if (!fs.existsSync(this.uploadDir)) {
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeName = path.basename(file.originalname);
  const filename = `${timestamp}-${safeName}`;
  const destino = path.join(this.uploadDir, filename);
  await fs.promises.writeFile(destino, file.buffer);

  const doc = this.repositorioDocumento.create({
    caminho: filename,
    requerimento: { id: requerimentoId } as Requerimento,
  });
  return this.repositorioDocumento.save(doc);
}


  async findOne(id: number) {
    const documento = await this.repositorioDocumento.findOne({
      where: { id }
    })

    if(!documento)
      throw new DocumentNotFoundException(id);

    return documento;
  }

  async createAtestado(createAtestado: CreateAtestadoDto){
    
  }
}
