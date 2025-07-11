import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Etapa } from "src/enums/etapa.enum";

export class ChangeStageRequerimentoDto {
    @IsInt()
    @IsNotEmpty()
    etapaAtual: Etapa;

    @IsInt()
    @IsNotEmpty()
    etapaDestino: Etapa;

    @IsString()
    @IsOptional()
    observacao: string;
}