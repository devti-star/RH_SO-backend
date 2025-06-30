import { PartialType } from '@nestjs/mapped-types';
import { CreateRequerimentoDto } from './create-requerimento.dto';

export class UpdateRequerimentoDto extends PartialType(CreateRequerimentoDto) {}
