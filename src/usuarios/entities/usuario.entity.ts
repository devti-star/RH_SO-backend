import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  TableInheritance,
  ChildEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "../../enums/role.enum";
import { Requerimento } from "../../requerimentos/entities/requerimento.entity";
import { hashSync } from "bcrypt";
import { RG } from "../../rg/entities/rg.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Usuario {
  constructor(
    nomeCompleto: string,
    email: string,
    cpf: string,
    numeroRg: string,
    orgaoExpeditor: string,
    senha: string,
    matricula: string,
    cargo: string,
    role: Role,
    departamento: string,
    secretaria: string,
    telefone: string,
  ) {
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.cpf = cpf;
    this.rg = new RG(numeroRg, orgaoExpeditor);
    this.senha = senha;
    this.matricula = matricula;
    this.cargo = cargo;
    this.role = role;
    this.departamento = departamento;
    this.secretaria = secretaria;
    this.telefone = telefone;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  nomeCompleto: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 25, unique: true })
  cpf: string;

  @OneToOne(() => RG, { cascade: true }) 
  @JoinColumn()
  rg: RG;

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
  senha?: string;

  @Column({ nullable: true })
  foto: string;

  @Column({ type: "int" })
  role: Role;

  @OneToMany(() => Requerimento, (requerimentos) => requerimentos.usuario)
  requerimentos: Requerimento[];

  @BeforeInsert()
  hashSenha() {
    if (this.senha) {
      this.senha = hashSync(this.senha, 10);
    }
  }

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  activatedAt: Date;

  @Column({ nullable: true })
  activationToken: string;
}

@ChildEntity()
export class Medico extends Usuario {
  constructor(
    nomeCompleto: string,
    email: string,
    cpf: string,
    numeroRg: string,
    orgaoExpeditor: string,
    senha: string,
    matricula: string,
    cargo: string,
    role: Role,
    crm: string,
    departamento: string,
    secretaria: string,
    telefone: string,
  ) {
    super(
      nomeCompleto,
      email,
      cpf,
      numeroRg,
      orgaoExpeditor,
      senha,
      matricula,
      cargo,
      role,
      departamento,
      secretaria,
      telefone,
    );
    this.crm = crm;
  }

  @Column({ length: 25, unique: true })
  crm: string;
}

@ChildEntity()
export class Enfermeiro extends Usuario {
  constructor(
    nomeCompleto: string,
    email: string,
    cpf: string,
    numeroRg: string,
    orgaoExpeditor: string,
    senha: string,
    matricula: string,
    cargo: string,
    role: Role,
    cre: string,
    departamento: string,
    secretaria: string,
    telefone: string,
  ) {
    super(
      nomeCompleto,
      email,
      cpf,
      numeroRg,
      orgaoExpeditor,
      senha,
      matricula,
      cargo,
      role,
      departamento,
      secretaria,
      telefone,
    );
    this.cre = cre;
  }

  @Column({ length: 25, unique: true })
  cre: string;
}