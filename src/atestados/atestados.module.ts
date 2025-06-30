import { Module } from '@nestjs/common';
import { AtestadosService } from './atestados.service';
import { AtestadosController } from './atestados.controller';

@Module({
  controllers: [AtestadosController],
  providers: [AtestadosService],
})
export class AtestadosModule {}
