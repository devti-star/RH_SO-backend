import { Test, TestingModule } from '@nestjs/testing';
import { ActivateService } from './activate.service';

describe('ActivateService', () => {
  let service: ActivateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivateService],
    }).compile();

    service = module.get<ActivateService>(ActivateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
