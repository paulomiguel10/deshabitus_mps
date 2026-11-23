// E-Convite — Firestore
import { StatusConvite } from './enums';
import { pendente } from '../utils/pendente';

export class Convite {
  constructor({ id, desafioId, remetenteId, convidadoId, status = StatusConvite.PENDENTE } = {}) {
    this.id = id;
    this.desafioId = desafioId;
    this.remetenteId = remetenteId;
    this.convidadoId = convidadoId;
    this.status = status;
  }

  aceitar() { return pendente('Convite.aceitar'); }
}
