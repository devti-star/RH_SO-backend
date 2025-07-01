import { Test, TestingModule } from '@nestjs/testing';
import { RgService } from './rg.service';

describe('RgService', () => {
  let service: RgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RgService],
    }).compile();

    service = module.get<RgService>(RgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
