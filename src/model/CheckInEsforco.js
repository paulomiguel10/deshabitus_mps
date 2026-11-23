// E-CheckInEsforco (DC-ENTIDADE) — parte da E-Jornada: registra (Jornada 1 ◆ 0..*)
// {RN021: nível de 1 a 5; um check-in por dia} {RN029: criado com sincronizado = false}
import { pendente } from '../utils/pendente';

export class CheckInEsforco {
  constructor({ id, jornadaId, data, nivel, observacao = null, sincronizado = false } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;     // composição com a jornada
    this.data = data;               // int AAAAMMDD
    this.nivel = nivel;             // int
    this.observacao = observacao;   // char[0..1]
    this.sincronizado = sincronizado; // boolean
  }

  // + marcarSincronizado() : void
  marcarSincronizado() { return pendente('CheckInEsforco.marcarSincronizado'); }
}
