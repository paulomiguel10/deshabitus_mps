// E-Gatilho (DC-ENTIDADE) — motivadoPor: E-RegistroTentacao 0..* — 0..1 E-Gatilho
import { pendente } from '../utils/pendente';

export class Gatilho {
  constructor({ id, descricao } = {}) {
    this.id = id;
    this.descricao = descricao; // char
  }

  // + listarGatilhos() : E-Gatilho  (estático)
  static listarGatilhos() { return pendente('Gatilho.listarGatilhos'); }
}
