import { Test, TestingModule } from '@nestjs/testing';
import { HistoricosController } from './historicos.controller';
import { HistoricosService } from './historicos.service';

describe('HistoricosController', () => {
  let controller: HistoricosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricosController],
      providers: [HistoricosService],
    }).compile();

    controller = module.get<HistoricosController>(HistoricosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
