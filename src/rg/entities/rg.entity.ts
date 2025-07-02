import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RG {
  constructor(proprietario: Usuario, numeroRg: string, orgaoExpeditor: string) {
    this.numeroRG = numeroRg;
    this.orgãoExpeditor = orgaoExpeditor;
    this.proprietario = proprietario;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (proprietario) => proprietario.rg, {eager: false, lazy: true})
  proprietario: Usuario;

  @Column({ nullable: false })
  numeroRG: string;

  @Column({ nullable: false })
  orgãoExpeditor: string;
}
