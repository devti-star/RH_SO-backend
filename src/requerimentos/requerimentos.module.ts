import { Module } from '@nestjs/common';
import { RequerimentosService } from './requerimentos.service';
import { RequerimentosController } from './requerimentos.controller';

@Module({
  controllers: [RequerimentosController],
  providers: [RequerimentosService],
})
export class RequerimentosModule {}
