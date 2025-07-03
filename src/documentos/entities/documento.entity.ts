import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ChildEntity,
  TableInheritance,
} from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

@Entity('documentos')
@TableInheritance({ column: { type: 'varchar', name: 'tipo_documento' } })
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  caminho: string;

  // 1) campo de FK explícito via JoinColumn
  @ManyToOne(() => Requerimento, (req) => req.documentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requerimentoId' })
  requerimento: Requerimento;

  // 2) opcional: data de upload
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

@ChildEntity()
export class Atestado extends Documento {
  @Column({ type: 'boolean', default: false })
  maior3dias: boolean;

  @Column({ type: 'boolean', default: false })
  concluido: boolean;

  @Column({ length: 255, nullable: true })
  justificativa: string;
}
