import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../../enums/role.enum';
import { Requerimento } from '../../requerimentos/entities/requerimento.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  nomeCompleto: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 25, unique: true })
  cpf: string;

  @Column({ length: 25, unique: true, nullable: true })
  rg: string;

  @Column({ length: 25, unique: true, nullable: true })
  crm: string;

  @Column({ length: 25, unique: true, nullable: true })
  cre: string;

  @Column({ length: 25, unique: true })
  matricula: string;

  @Column({ length: 150 })
  departamento: string;

  @Column({ length: 150 })
  secretaria: string;

  @Column({ length: 25 })
  telefone: string;

  @Column({ length: 150 })
  cargo: string;

  @Column({ select: false })
  senha: string;

  @Column({ nullable: true })
  foto: string;

  @Column({ type: 'int' })
  role: Role;

  @OneToMany(() => Requerimento, (requerimento) => requerimento.usuario)
  requerimentos: Requerimento[];
}
