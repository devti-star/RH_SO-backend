import { IsNotEmpty, IsEnum, IsString, IsOptional, IsInt } from 'class-validator';
import { TipoRequerimento } from '../../enums/tipo-requerimento.enum';
import { Status } from '../../enums/status.enum';
import { Etapa } from '../../enums/etapa.enum';

export class CreateRequerimentoDto {
  @IsNotEmpty()
  @IsEnum(TipoRequerimento)
  tipo: TipoRequerimento;

  @IsOptional()
  @IsString()
  assinatura?: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsEnum(Etapa)
  etapa: Etapa;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsNotEmpty()
  @IsInt()
  usuarioId: number; // ID do usuário solicitante
}
