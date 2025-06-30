import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDocumentoDto {
  @IsNotEmpty()
  @IsString()
  caminho: string;

  @IsNotEmpty()
  @IsInt()
  requerimentoId: number;
}
