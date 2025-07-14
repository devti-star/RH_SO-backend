// src/documentos/documentos.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atestado, Documento } from './entities/documento.entity';
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
    @InjectRepository(Atestado) 
    private readonly repositorioAtestado: Repository<Atestado>,
    private readonly fileStorage: FileStorageService,
  ) {}

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

    const doc = this.repositorioAtestado.create({
      caminho: filename,
      requerimento: { id: requerimentoId } as Requerimento,
      dataEnvio: new Date(),
    });
    return this.repositorioAtestado.save(doc);
  }

  // Substitui arquivo se existir, ou cria um novo se não existir
  async substituirArquivoDocumento(requerimentoId: number, file: Express.Multer.File): Promise<Documento> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    // Garante que o uploadDir existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Busca documento já existente
    let documentoExistente = await this.repositorioDocumento.findOne({
      where: { requerimento: { id: requerimentoId } }
    });

    // Gera novo nome de arquivo seguro e salva no disco
    const timestamp = Date.now();
    const safeName = path.basename(file.originalname);
    const filename = `${timestamp}-${safeName}`;
    const destino = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(destino, file.buffer);

    if (!documentoExistente) {
      // Se NÃO existir, cria um novo documento e retorna!
      const novoDoc = this.repositorioDocumento.create({
        caminho: filename,
        requerimento: { id: requerimentoId } as Requerimento,
        dataEnvio: new Date()
      });
      return this.repositorioDocumento.save(novoDoc);
    } else {
      // Se existir, remove o antigo do disco (se existir)
      if (documentoExistente.caminho) {
        const antigoPath = path.join(this.uploadDir, documentoExistente.caminho);
        if (fs.existsSync(antigoPath)) {
          await fs.promises.unlink(antigoPath);
        }
      }

      // Atualiza o registro do banco de dados
      documentoExistente.caminho = filename;
      documentoExistente.dataEnvio = new Date();
      await this.repositorioDocumento.save(documentoExistente);

      return documentoExistente;
    }
  }

  async findOne(id: number) {
    const documento = await this.repositorioDocumento.findOne({
      where: { id }
    });

    if (!documento)
      throw new DocumentNotFoundException(id);

    return documento;
  }

  async createAtestado(createAtestado: CreateAtestadoDto) {
    // implementar se necessário
  }
}
