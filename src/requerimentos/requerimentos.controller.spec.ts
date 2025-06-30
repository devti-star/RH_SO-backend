import { Test, TestingModule } from '@nestjs/testing';
import { RequerimentosController } from './requerimentos.controller';
import { RequerimentosService } from './requerimentos.service';

describe('RequerimentosController', () => {
  let controller: RequerimentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequerimentosController],
      providers: [RequerimentosService],
    }).compile();

    controller = module.get<RequerimentosController>(RequerimentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
