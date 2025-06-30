import { Test, TestingModule } from '@nestjs/testing';
import { RequerimentosService } from './requerimentos.service';

describe('RequerimentosService', () => {
  let service: RequerimentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequerimentosService],
    }).compile();

    service = module.get<RequerimentosService>(RequerimentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
