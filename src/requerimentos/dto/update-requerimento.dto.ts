import { PartialType } from '@nestjs/mapped-types';
import { CreateRequerimentoDto } from './create-requerimento.dto';
import { IsOptional, IsArray, ValidateNested, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Checklist } from 'src/documentos/models/checklist';

export class DocumentoJustificativaDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  justificativa?: string;

  @IsOptional()
  @IsArray()
  checklist?: Checklist[]; // Ou o tipo correto, ex: Checklist[]

  @IsOptional()
  @IsBoolean()
  concluido?: boolean; // <-- Adicione esta linha!

  @IsOptional()
  @IsBoolean()
  maior3dias:boolean;

  @IsOptional()
  @IsString()
  qtdDias?: string;

  @IsOptional()
  @IsString()
  assinatura?: string;
}

export class UpdateRequerimentoDto extends PartialType(CreateRequerimentoDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentoJustificativaDto)
  documentos?: DocumentoJustificativaDto[];

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  etapa?: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}
