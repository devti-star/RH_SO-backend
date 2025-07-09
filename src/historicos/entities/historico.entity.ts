// Historico <1:1> Requerimento <N:1> Usuario
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';
import { Etapa } from 'src/enums/etapa.enum';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('historicos')
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Requerimento, (requerimento) => requerimento.historico)
  @JoinColumn()
  requerimento: Requerimento;

  @ManyToOne(() => Usuario, {nullable: true})
  @JoinColumn()
  funcionario: Usuario;

  @Column({ type: 'int' })
  etapaAtual: Etapa;

  @Column({ type: 'int' })
  etapaDestino: Etapa;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacao: string;

  @CreateDateColumn()
  dataRegistro: Date;
}
