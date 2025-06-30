import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

@Entity('documentos')
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  caminho: string; // caminho do arquivo (ex: uploads/...)

  @ManyToOne(() => Requerimento, (requerimento) => requerimento.documentos, { onDelete: 'CASCADE' })
  requerimento: Requerimento;
}
