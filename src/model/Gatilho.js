// E-Gatilho (DC-ENTIDADE) — motivadoPor: E-RegistroTentacao 0..* — 0..1 E-Gatilho
import { buscarTodos } from '../database/banco';

export class Gatilho {
  constructor({ id, descricao } = {}) {
    this.id = id;
    this.descricao = descricao; // char
  }

  // + listarGatilhos() : E-Gatilho  (estático)
  static async listarGatilhos() {
    const linhas = await buscarTodos('SELECT id, descricao FROM gatilho ORDER BY rowid');
    return linhas.map((linha) => new Gatilho(linha));
  }
}
