import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from 'src/enums/status.enum';
import { Checklist } from '../models/checklist';
import { IsArray } from 'class-validator';

export class CreateAtestadoDto {
  @IsString()
  @Length(1, 255)
  caminho: string;

  @IsBoolean()
  maior3dias: boolean = false;

  @IsBoolean()
  concluido: boolean = false;

  @IsEnum(Status)
  status: Status = Status.EM_PROCESSO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Checklist)
  checklist: Checklist[];

  @IsString()
  @IsOptional()
  @Length(0, 255)
  justificativa?: string;

  @IsInt()
  requerimentoId: number;
}
