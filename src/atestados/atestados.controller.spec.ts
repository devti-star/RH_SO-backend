import { Test, TestingModule } from '@nestjs/testing';
import { AtestadosController } from './atestados.controller';
import { AtestadosService } from './atestados.service';

describe('AtestadosController', () => {
  let controller: AtestadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtestadosController],
      providers: [AtestadosService],
    }).compile();

    controller = module.get<AtestadosController>(AtestadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
