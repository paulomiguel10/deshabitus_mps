// E-Habito
import { pendente } from '../utils/pendente';

export class Habito {
  constructor({ id, nome, consumoDiario, custoUnitario, tempoMedioConsumo } = {}) {
    this.id = id;
    this.nome = nome;
    this.consumoDiario = consumoDiario;
    this.custoUnitario = custoUnitario;
    this.tempoMedioConsumo = tempoMedioConsumo; // minutos (RN08)
  }

  possuiDadosCompletos() { return pendente('Habito.possuiDadosCompletos'); } // RN06
  calcularEconomia(dias) { return pendente('Habito.calcularEconomia'); }       // RN13
  calcularTempoPoupado(dias) { return pendente('Habito.calcularTempoPoupado'); } // RN14
  obterNome() { return this.nome; }
}
