import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';
import { Etapa } from '../../enums/etapa.enum';

export class CreateHistoricoDto {
  @IsNotEmpty()
  @IsInt()
  requerimentoId: number; // ID do requerimento relacionado

  @IsNotEmpty()
  @IsInt()
  funcionarioId: number;

  @IsNotEmpty()
  @IsInt()
  etapaAtual: Etapa;

  @IsNotEmpty()
  @IsInt()
  etapaDestino: Etapa;

  @IsOptional()
  @IsString()
  observacao?: string;
}
