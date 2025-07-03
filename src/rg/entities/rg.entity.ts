import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RG {
  constructor(numeroRg: string, orgaoExpeditor: string) {
    this.numeroRG = numeroRg;
    this.orgãoExpeditor = orgaoExpeditor;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  numeroRG: string;

  @Column({ nullable: false })
  orgãoExpeditor: string;
}
