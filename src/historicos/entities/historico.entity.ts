import { OneToOne } from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

export class Historico {


    @OneToOne(() => Requerimento, (requerimento) => requerimento.historico)
    requerimento: Requerimento;
}
