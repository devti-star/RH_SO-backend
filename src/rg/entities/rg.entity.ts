import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class RG {
  constructor(proprietario: Usuario, numeroRg: string, orgaoExpeditor: string) {
    this.numeroRG = numeroRg;
    this.orgãoExpeditor = orgaoExpeditor;
    this.proprietario = proprietario;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (proprietario) => proprietario.rg)
  proprietario: Usuario;

  @Column({ nullable: false })
  numeroRG: string;

  @Column({ nullable: false })
  orgãoExpeditor: string;
}
