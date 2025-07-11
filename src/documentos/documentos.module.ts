import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atestado, Documento } from './entities/documento.entity';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { FileStorageService } from '../shared/services/file-storage.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documento, Atestado]),
    SharedModule,
  ],
  providers: [DocumentosService, FileStorageService],
  controllers: [DocumentosController],
  exports: [TypeOrmModule, DocumentosService, FileStorageService],
})
export class DocumentosModule {}
