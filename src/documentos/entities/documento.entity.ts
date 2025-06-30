import { ManyToOne } from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

export class Documento {


    @ManyToOne(() => Requerimento, (requerimento) => requerimento.documentos)
    requerimento: Requerimento;
}
