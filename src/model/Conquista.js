// E-Conquista
// {RN22/RN23: só medalhas e conquistas de manutenção; os marcos são calculados pela Jornada}
import { pendente } from '../utils/pendente';

export class Conquista {
  constructor({ id, nome, tipo, diasNecessarios } = {}) {
    this.id = id;
    this.nome = nome;
    this.tipo = tipo; // TipoConquista.MEDALHA | TipoConquista.MANUTENCAO
    this.diasNecessarios = diasNecessarios;
  }

  static obterConquistas(jornadaId) { return pendente('Conquista.obterConquistas'); }
}
