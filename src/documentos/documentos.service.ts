// src/documentos/documentos.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Requerimento } from '../requerimentos/entities/requerimento.entity';
import { FileStorageService } from '../shared/services/file-storage.service';

@Injectable()
export class DocumentosService {
  private uploadDir = path.resolve(__dirname, '../../uploads');

  constructor(
    @InjectRepository(Documento)
    private readonly repo: Repository<Documento>,
    private readonly fileStorage: FileStorageService,
  ) {
  }

  async create(requerimentoId: number, file: Express.Multer.File): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const timestamp = Date.now();
    const safeName = path.basename(file.originalname);
    const filename = `${timestamp}-${safeName}`;
    const destino = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(destino, file.buffer);

    const doc = this.repo.create({
      caminho: filename,
      requerimento: { id: requerimentoId } as Requerimento,
    });
    return this.repo.save(doc);
  }
}
