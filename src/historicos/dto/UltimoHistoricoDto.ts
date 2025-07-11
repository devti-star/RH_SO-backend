export class UltimoHistoricoDto {
  id: number;
  etapaAtual: number;
  etapaDestino: number;
  observacao?: string;
  dataRegistro: Date;

  constructor(historico: any) {
    this.id = historico.id;
    this.etapaAtual = historico.etapaAtual;
    this.etapaDestino = historico.etapaDestino;
    this.observacao = historico.observacao;
    this.dataRegistro = historico.dataRegistro;
  }
}