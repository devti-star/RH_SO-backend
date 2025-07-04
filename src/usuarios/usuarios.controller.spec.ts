import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Medico } from './entities/usuario.entity';
import { Enfermeiro } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { RG } from 'src/rg/entities/rg.entity';



describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuarioRepo: Repository<Usuario>;

  // Mock completo do usuário com todos os campos obrigatórios
  const mockRG = {
    id: 1,
    numeroRG: '1234567',
    orgãoExpeditor: 'SSP',
    proprietario: null as any
  };

  const mockUsuario: Partial<Usuario> = {
    id: 1,
    nomeCompleto: 'Test User',
    email: 'test@example.com',
    cpf: '12345678900',
    matricula: 'TEST123',
    departamento: 'Test Department',
    secretaria: 'Test Secretaria',
    telefone: '123456789',
    cargo: 'Test Cargo',
    role: Role.PADRAO,
    isActive: false,
    activationToken: 'test-token',
    rg: mockRG as RG, // Agora é uma instância válida de RG
    requerimentos: [],
    senha: undefined,
    foto: undefined,
    activatedAt: undefined
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn().mockReturnValue(mockUsuario),
            save: jest.fn().mockResolvedValue(mockUsuario),
            findOne: jest.fn().mockResolvedValue(mockUsuario),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Medico),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Enfermeiro),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuarioRepo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('deve criar usuário com token de ativação', async () => {
    const createDto = {
      nomeCompleto: 'Test User',
      email: 'test@example.com',
      cpf: '12345678900',
      rg: '1234567',
      orgaoExpeditor: 'SSP',
      senha: 'Senha@123',
      matricula: 'TEST123',
      cargo: 'Tester',
      role: Role.PADRAO,
      departamento: 'TI',
      secretaria: 'Administração',
      telefone: '6799998888'
    } as CreateUsuarioDto;

    const result = await service.criar(createDto);

    expect(result.activationToken).toBeDefined();
    expect(result.isActive).toBe(false);
    expect(usuarioRepo.save).toHaveBeenCalled();
  });

  it('deve ativar usuário por token', async () => {
    const token = 'valid-token';

    jest.spyOn(usuarioRepo, 'findOne').mockResolvedValue({
      ...mockUsuario,
      activationToken: token,
    } as Usuario);

    await service.activateByToken(token);

    expect(usuarioRepo.update).toHaveBeenCalledWith(mockUsuario.id, {
      isActive: true,
      activatedAt: expect.any(Date),
      activationToken: null
    });
  });

  it('deve falhar ao ativar com token inválido', async () => {
    jest.spyOn(usuarioRepo, 'findOne').mockResolvedValue(null);

    await expect(service.activateByToken('invalid-token'))
      .rejects
      .toThrow('Token de ativação inválido');
  });
});