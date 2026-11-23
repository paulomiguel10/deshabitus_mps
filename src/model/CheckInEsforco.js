// E-CheckInEsforco
import { pendente } from '../utils/pendente';

export class CheckInEsforco {
  constructor({ id, jornadaId, data, nivel, observacao = null, sincronizado = false } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;
    this.data = data;   // AAAA-MM-DD (RN21: 1 por dia)
    this.nivel = nivel; // 1 a 5 (RN21)
    this.observacao = observacao;
    this.sincronizado = sincronizado;
  }

  static obterCheckInsSemana(jornadaId) { return pendente('CheckInEsforco.obterCheckInsSemana'); }
  marcarSincronizado() { return pendente('CheckInEsforco.marcarSincronizado'); }
}
