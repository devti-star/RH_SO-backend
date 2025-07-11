import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoDto } from './create-documento.dto';
import { Checklist } from '../models/checklist';

export class UpdateDocumentoDto extends PartialType(CreateDocumentoDto) {
  justificativa?: string;
  checklist?: Checklist[]; // Ou use o tipo correto se tiver, como Checklist[]
}
