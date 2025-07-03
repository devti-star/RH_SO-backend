import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documento } from './entities/documento.entity';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documento]),
  ],
  providers: [DocumentosService],
  controllers: [DocumentosController],
  exports: [DocumentosService],
})
export class DocumentosModule {}
