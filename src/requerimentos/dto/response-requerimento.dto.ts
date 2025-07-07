import { Etapa } from "src/enums/etapa.enum";
import { TipoRequerimento } from "src/enums/tipo-requerimento.enum";
import { Requerimento } from "../entities/requerimento.entity";
import { UsuarioResponseDto } from "src/usuarios/dto/usuario-response.dto";

const etapaStatusMap: Record<Etapa, string> = {
  [Etapa.TRIAGEM]: 'triagem',
  [Etapa.ENFERMEIRO]: 'enfermeiro',
  [Etapa.MEDICO]: 'medico',
  [Etapa.AJUSTE]: 'ajustes',
};

export class RequerimentoReponseDto{
    constructor(requerimento: Requerimento){
        this.id = requerimento.id;
        this.assinatura = requerimento.assinatura;
        this.status = etapaStatusMap[requerimento.etapa];
        this.etapa = requerimento.etapa;
        this.tipo = requerimento.tipo;
        this.observacao = requerimento.observacao;
        this.usuario = new UsuarioResponseDto(requerimento.usuario);
    }
    id: number;
    tipo: TipoRequerimento;
    assinatura: string;
    status: string;
    etapa: Etapa;
    observacao?: string;
    usuario: UsuarioResponseDto;
}