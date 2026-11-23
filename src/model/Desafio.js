// E-Desafio — só existe online, no Firestore (RNF10 / US02)
// {RN11: só entra quem tem convite de um participante} {o desafio some quando não resta participante}
import { pendente } from '../utils/pendente';

export class Desafio {
  constructor({ id, nome } = {}) {
    this.id = id;
    this.nome = nome;
  }

  static criarDesafio(nome) { return pendente('Desafio.criarDesafio'); }
  convidar(remetente, emailConvidado) { return pendente('Desafio.convidar'); }
  adicionarParticipante(usuario) { return pendente('Desafio.adicionarParticipante'); }
  removerUsuario(usuario) { return pendente('Desafio.removerUsuario'); }
  obterProgresso() { return pendente('Desafio.obterProgresso'); } // RN12: só dias
  adicionarMensagem(texto, autor) { return pendente('Desafio.adicionarMensagem'); }
}
