import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './entities/documento.entity';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { FileStorageService } from '../shared/services/file-storage.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documento]),
    SharedModule,
  ],
  providers: [DocumentosService, FileStorageService],
  controllers: [DocumentosController],
  exports: [DocumentosService, FileStorageService],
})
export class DocumentosModule {}
