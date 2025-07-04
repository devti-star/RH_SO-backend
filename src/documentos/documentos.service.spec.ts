import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosService } from './documentos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Documento } from './entities/documento.entity';
import * as fs from 'fs';

jest.mock('src/enums/etapa.enum', () => ({}), { virtual: true });

describe('DocumentosService', () => {
  let service: DocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentosService,
        {
          provide: getRepositoryToken(Documento),
          useValue: { create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DocumentosService>(DocumentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sanitizes filenames to stay inside upload directory', async () => {
    const writeSpy = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    const file = {
      originalname: '../escape.txt',
      buffer: Buffer.from('data'),
    } as Express.Multer.File;

    await service.create(1, file);

    const dest = writeSpy.mock.calls[0][0] as string;
    expect(dest.startsWith(service['uploadDir'])).toBe(true);
    expect(dest).not.toContain('..');

    writeSpy.mockRestore();
  });
});
