// E-Habito (DC-ENTIDADE) — parte da E-Jornada: acompanha (Jornada 1 ◆ 1 Habito)
import { pendente } from '../utils/pendente';

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
  possuiDadosCompletos() { return pendente('Habito.possuiDadosCompletos'); }
  // + calcularEconomia(dias : int) : double  (RN013)
  calcularEconomia(dias) { return pendente('Habito.calcularEconomia'); }
  // + calcularTempoPoupado(dias : int) : int  (RN014)
  calcularTempoPoupado(dias) { return pendente('Habito.calcularTempoPoupado'); }
  // + obterNome() : char
  obterNome() { return this.nome; }
}
