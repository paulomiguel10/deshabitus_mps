// E-Habito (DC-ENTIDADE) — parte da E-Jornada: acompanha (Jornada 1 ◆ 1 Habito)

export class Habito {
  constructor({ id, jornadaId, nome, consumoDiario, custoUnitario, tempoMedioConsumo } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;                 // composição: o hábito pertence à jornada
    this.nome = nome;                           // char
    this.consumoDiario = consumoDiario;         // int
    this.custoUnitario = custoUnitario;         // double
    this.tempoMedioConsumo = tempoMedioConsumo; // int (minutos)
  }

  // + possuiDadosCompletos() : boolean  (RN06)
  // RN06: consumo diário e custo unitário obrigatórios · RN08: tempo médio obrigatório
  // (custo 0 é aceito: hábitos como redes sociais não custam dinheiro)
  possuiDadosCompletos() {
    const inteiroPositivo = (v) => Number.isInteger(v) && v > 0;
    return Boolean(this.nome?.trim())
      && inteiroPositivo(this.consumoDiario)
      && typeof this.custoUnitario === 'number' && Number.isFinite(this.custoUnitario) && this.custoUnitario >= 0
      && inteiroPositivo(this.tempoMedioConsumo);
  }
  // + calcularEconomia(dias : int) : double  (RN013)
  // custo unitário × consumo evitado (dias × consumo diário)
  calcularEconomia(dias) {
    return Math.max(0, dias) * this.consumoDiario * this.custoUnitario;
  }
  // + calcularTempoPoupado(dias : int) : int  (RN014)
  // tempo médio × consumo evitado, em minutos
  calcularTempoPoupado(dias) {
    return Math.max(0, dias) * this.consumoDiario * this.tempoMedioConsumo;
  }
  // + obterNome() : char
  obterNome() { return this.nome; }
}
