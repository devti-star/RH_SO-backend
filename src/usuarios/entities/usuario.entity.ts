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
import { RG } from "src/rg/entities/rg.entity";

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
    role: Role
  ) {
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.cpf = cpf;
    this.rg = new RG(this, numeroRg, orgaoExpeditor);
    this.senha = senha;
    this.matricula = matricula;
    this.cargo = cargo;
    this.role = role;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  nomeCompleto: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 25, unique: true })
  cpf: string;

  @OneToOne(() => RG, (rg) => rg.proprietario, { cascade: true })
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
  senha: string;

  @Column({ nullable: true })
  foto: string;

  @Column({ type: "int" })
  role: Role;

  @OneToMany(() => Requerimento, (requerimento) => requerimento.usuario)
  requerimentos: Requerimento[];

  @BeforeInsert()
  hashSenha() {
    if (this.senha) {
      this.senha = hashSync(this.senha, 10);
    }
  }
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
    crm: string
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
      role
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
    cre: string
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
      role
    );
    this.cre = cre;
  }

  @Column({ length: 25, unique: true })
  cre: string;
}
