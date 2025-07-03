// src/documentos/documentos.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Requerimento } from '../requerimentos/entities/requerimento.entity';

@Injectable()
export class DocumentosService {
  private uploadDir = path.resolve(__dirname, '../../uploads');

  constructor(
    @InjectRepository(Documento)
    private readonly repo: Repository<Documento>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async create(requerimentoId: number, file: Express.Multer.File): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const destino = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(destino, file.buffer);

    // Aqui passamos o objeto parcial de Requerimento
   const doc = this.repo.create({
    caminho: filename,
    requerimento: { id: requerimentoId } as Requerimento,
  });
  return this.repo.save(doc);
    }
}
