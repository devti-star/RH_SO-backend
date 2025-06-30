import { Test, TestingModule } from '@nestjs/testing';
import { HistoricosService } from './historicos.service';

describe('HistoricosService', () => {
  let service: HistoricosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricosService],
    }).compile();

    service = module.get<HistoricosService>(HistoricosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
