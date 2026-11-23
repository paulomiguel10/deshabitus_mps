// E-Convite (DC-ENTIDADE) — Firestore
// Associações: E-Desafio gera (1 — 0..*) · E-Usuario convidado (1 — 0..*) · E-Usuario remetente (1 — 0..*)
import { StatusConvite } from './enums';
import { pendente } from '../utils/pendente';

export class Convite {
  constructor({ id, desafioId, remetenteId, convidadoId, status = StatusConvite.PENDENTE } = {}) {
    this.id = id;
    this.desafioId = desafioId;
    this.remetenteId = remetenteId;
    this.convidadoId = convidadoId;
    this.status = status; // StatusConvite
  }

  // + aceitar() : void
  aceitar() { return pendente('Convite.aceitar'); }
}
