import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosService } from './documentos.service';
import { FileStorageService } from '../shared/services/file-storage.service';

describe('DocumentosService', () => {
  let service: DocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentosService, FileStorageService],
    }).compile();

    service = module.get<DocumentosService>(DocumentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
