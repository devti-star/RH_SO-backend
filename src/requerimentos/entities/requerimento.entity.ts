import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Status } from '../../enums/status.enum';
import { Etapa } from '../../enums/etapa.enum';
import { TipoRequerimento } from '../../enums/tipo-requerimento.enum';
import { Documento } from '../../documentos/entities/documento.entity';
import { Historico } from '../../historicos/entities/historico.entity';

@Entity('requerimentos')
export class Requerimento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tipo: TipoRequerimento;

  @Column()
  assinatura: string;

  @Column({ type: 'int' })
  status: Status;

  @Column({ type: 'int' })
  etapa: Etapa;

  @Column({ length: 255, nullable: true })
  observacao: string;

  @CreateDateColumn()
  criadoEm: Date;

  // RELACIONAMENTO COM USUÁRIO (N requs para 1 usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.requerimentos, { eager: true })
  usuario: Usuario;

  // RELACIONAMENTO COM DOCUMENTOS (1 requerimento para N documentos)
  @OneToMany(() => Documento, (documento) => documento.requerimento)
  documentos: Documento[];

  // RELACIONAMENTO 1 PARA 1 COM HISTÓRICO (historico tem a foreign key)
  @OneToOne(() => Historico, (historico) => historico.requerimento)
  historico: Historico;
}
