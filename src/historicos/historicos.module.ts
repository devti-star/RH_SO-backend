import { Module } from '@nestjs/common';
import { HistoricosService } from './historicos.service';
import { HistoricosController } from './historicos.controller';

@Module({
  controllers: [HistoricosController],
  providers: [HistoricosService],
})
export class HistoricosModule {}
