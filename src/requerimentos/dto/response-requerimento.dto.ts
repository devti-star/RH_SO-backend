import { Etapa } from "src/enums/etapa.enum";
import { Status } from "src/enums/status.enum";
import { TipoRequerimento } from "src/enums/tipo-requerimento.enum";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Requerimento } from "../entities/requerimento.entity";
import { Exclude, Expose } from "class-transformer";
import { UsuarioResponseDto } from "src/usuarios/dto/usuario-response.dto";
import { UltimoHistoricoDto } from "src/historicos/dto/UltimoHistoricoDto";

export class RequerimentoReponseDto{
    constructor(requerimento: Requerimento){
        this.id = requerimento.id;
        this.assinatura = requerimento.assinatura;
        this.status = requerimento.status;
        this.etapa = requerimento.etapa;
        this.tipo = requerimento.tipo;
        this.observacao = requerimento.observacao;
        this.usuario = new UsuarioResponseDto(requerimento.usuario);
        if (Array.isArray(requerimento.historico) && requerimento.historico.length > 0) {
            // Ordena por dataRegistro, pega o último e instancia o DTO
            const ultimoHistorico = requerimento.historico
                .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())[0];
            this.historico = new UltimoHistoricoDto(ultimoHistorico);
        } else {
            this.historico = undefined; // ou null, como preferir
        }
    }
    id: number;
    tipo: TipoRequerimento;
    assinatura: string;
    status: Status;
    etapa: Etapa;
    observacao?: string;
    usuario: UsuarioResponseDto;
    historico?: UltimoHistoricoDto;

}