import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { Requerimento } from '../requerimentos/entities/requerimento.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private readonly repo: Repository<Documento>,
    private readonly filesService: FilesService,
  ) {}

  async create(requerimentoId: number, file: Express.Multer.File): Promise<Documento> {
    const filename = await this.filesService.save(file);

    const doc = this.repo.create({
      caminho: filename,
      requerimento: { id: requerimentoId } as Requerimento,
    });
    return this.repo.save(doc);
  }
}
