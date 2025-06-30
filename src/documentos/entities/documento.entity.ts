import { Entity, ManyToOne } from "typeorm";
import { Requerimento } from "../../requerimentos/entities/requerimento.entity";

@Entity()
export class Documento {
  @ManyToOne(() => Requerimento, (requerimento) => requerimento.documentos)
  requerimento: Requerimento;
}
