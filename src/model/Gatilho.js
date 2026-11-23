// E-Gatilho (lista fixa de motivos; ver seed em database/schema.js)
import { pendente } from '../utils/pendente';

export class Gatilho {
  constructor({ id, descricao } = {}) {
    this.id = id;
    this.descricao = descricao;
  }

  static listarGatilhos() { return pendente('Gatilho.listarGatilhos'); }
}
