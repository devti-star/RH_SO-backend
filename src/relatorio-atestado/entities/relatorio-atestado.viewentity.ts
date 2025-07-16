import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: (connection) =>
    connection
      .createQueryBuilder()
      .select("r.id", "id")
      .addSelect("u.nomeCompleto", "nomeCompleto")
      .addSelect("u.email", "email")
      .addSelect("u.cpf", "cpf")
      .addSelect("u.matricula", "matricula")
      .addSelect("u.departamento", "departamento")
      .addSelect("u.secretaria", "secretaria")
      .addSelect("u.telefone", "telefone")
      .addSelect("string_agg(DISTINCT d.tipo_documento, ', ')", "incisos")
      .addSelect("resp.nomeCompleto", "reponsavelPelaAvaliacao")
      .addSelect("coord.nomeCompleto", "coordenador")
      .addSelect("med.nomeCompleto", "medico")
      .addSelect("CASE WHEN r.status = 1 THEN true ELSE false END", "deferido")
      .addSelect("SUM(CAST(NULLIF(d.qtdDias, '') AS INTEGER))", "qtdDias")
      .from("requerimento", "r")
      .innerJoin("usuario", "u", "r.usuarioId = u.id")
      .leftJoin("documentos", "d", "d.requerimentoId = r.id")
      .leftJoin("historicos", "hResp", "hResp.requerimentoId = r.id AND hResp.etapaDestino = 1")
      .leftJoin("usuario", "resp", "resp.id = hResp.funcionarioId")
      .leftJoin("historicos", "hCoord", "hCoord.requerimentoId = r.id AND hCoord.etapaDestino = 2")
      .leftJoin("usuario", "coord", "coord.id = hCoord.funcionarioId")
      .leftJoin("historicos", "hMed", "hMed.requerimentoId = r.id AND hMed.etapaDestino = 3")
      .leftJoin("usuario", "med", "med.id = hMed.funcionarioId")
      .groupBy("r.id")
      .addGroupBy("u.nomeCompleto")
      .addGroupBy("u.email")
      .addGroupBy("u.cpf")
      .addGroupBy("u.matricula")
      .addGroupBy("u.departamento")
      .addGroupBy("u.secretaria")
      .addGroupBy("u.telefone")
      .addGroupBy("resp.nomeCompleto")
      .addGroupBy("coord.nomeCompleto")
      .addGroupBy("med.nomeCompleto")
      .addGroupBy("r.status"),
})
export class RelatorioAtestado {
  @ViewColumn()
  id: number;

  @ViewColumn()
  nomeCompleto: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  cpf: string;

  @ViewColumn()
  matricula: string;

  @ViewColumn()
  departamento: string;

  @ViewColumn()
  secretaria: string;

  @ViewColumn()
  telefone: string;

  @ViewColumn()
  incisos: string;

  @ViewColumn()
  reponsavelPelaAvaliacao: string;

  @ViewColumn()
  coordenador: string;

  @ViewColumn()
  medico: string;

  @ViewColumn()
  deferido: boolean;

  @ViewColumn()
  qtdDias: number;
}
