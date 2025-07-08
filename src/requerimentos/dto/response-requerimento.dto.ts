import { Etapa } from "src/enums/etapa.enum";
import { Status } from "src/enums/status.enum";
import { TipoRequerimento } from "src/enums/tipo-requerimento.enum";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Requerimento } from "../entities/requerimento.entity";
import { Exclude, Expose } from "class-transformer";
import { UsuarioResponseDto } from "src/usuarios/dto/usuario-response.dto";

export class RequerimentoReponseDto{
    constructor(requerimento: Requerimento){
        this.id = requerimento.id;
        this.assinatura = requerimento.assinatura;
        this.status = requerimento.status;
        this.etapa = requerimento.etapa;
        this.tipo = requerimento.tipo;
        this.observacao = requerimento.observacao;
        this.usuario = new UsuarioResponseDto(requerimento.usuario);
    }
    id: number;
    tipo: TipoRequerimento;
    assinatura: string;
    status: Status;
    etapa: Etapa;
    observacao?: string;
    usuario: UsuarioResponseDto;
}