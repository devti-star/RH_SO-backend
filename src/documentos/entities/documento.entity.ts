import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ChildEntity,
  TableInheritance,
  CreateDateColumn,
} from 'typeorm';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

@Entity('documentos')
@TableInheritance({ column: { type: 'varchar', name: 'tipo_documento' } })
export class Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  caminho: string; // caminho do arquivo (ex: uploads/...)

  @ManyToOne(() => Requerimento, (requerimento) => requerimento.documentos, { onDelete: 'CASCADE' })
  requerimento: Requerimento;

  @CreateDateColumn({ name: 'data_envio' })
  dataEnvio: Date;
}

@ChildEntity()
export class Atestado extends Documento {
  @Column({ type: 'boolean', default: false })
  maior3dias: boolean; // Indica se o atestado é maior que 3 dias

  @Column({ type: 'boolean', default: false })
  concluido: boolean; // Indica se o atestado foi concluído

  @Column({ length: 255, nullable: true })
  justificativa: string; // Justificativa para o atestado, se necessário

  // Adicione mais campos que sejam específicos de atestado, se necessário
}

