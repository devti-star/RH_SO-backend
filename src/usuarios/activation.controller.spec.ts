import { Test, TestingModule } from '@nestjs/testing';
import { ActivationController } from './activation.controller';
import { UsuariosService } from './usuarios.service';
import { Response } from 'express';

describe('ActivationController', () => {
  let controller: ActivationController;
  let usuariosService: UsuariosService;
  const mockResponse = {
    redirect: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivationController],
      providers: [
        {
          provide: UsuariosService,
          useValue: {
            activateByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActivationController>(ActivationController);
    usuariosService = module.get<UsuariosService>(UsuariosService);
  });

  it('deve redirecionar para sucesso', async () => {
    jest.spyOn(usuariosService, 'activateByToken').mockResolvedValue({} as any);
    
    await controller.activateAccount('valid-token', mockResponse);
    
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      `${process.env.FRONTEND_URL}/activation-success`
    );
  });

  it('deve redirecionar para erro', async () => {
    jest.spyOn(usuariosService, 'activateByToken').mockRejectedValue(new Error('Token inválido'));
    
    await controller.activateAccount('invalid-token', mockResponse);
    
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('/activation-error')
    );
  });
});