// E-Desafio (DC-ENTIDADE) — fica só no Firestore (exige internet, RNF10 / US02)
// {RN011: só entra quem tem convite de um participante} {RN012: grupo vê só os dias de progresso}
// {RN04: ao excluir a conta, removerUsuario() tira o usuário do desafio e apaga seus convites e mensagens;
//  o desafio some quando não resta participante}
// Associações: gera (1 — 0..*) E-Convite · contem (1 — 0..*) E-Mensagem
//              participa (E-Usuario 1..* — 0..*) · cria (E-Usuario 0..1 — 0..*)
import { pendente } from '../utils/pendente';

export class Desafio {
  constructor({ id, nome } = {}) {
    this.id = id;
    this.nome = nome; // char
  }

  // + removerUsuario(usuario : E-Usuario) : void
  removerUsuario(usuario) { return pendente('Desafio.removerUsuario'); }
  // + convidar(remetente : E-Usuario, convidado : E-Usuario) : void
  convidar(remetente, convidado) { return pendente('Desafio.convidar'); }
  // + aceitarConvite(convite : E-Convite) : void
  aceitarConvite(convite) { return pendente('Desafio.aceitarConvite'); }
  // + adicionarParticipante(usuario : E-Usuario) : void
  adicionarParticipante(usuario) { return pendente('Desafio.adicionarParticipante'); }
  // + obterProgresso() : int
  obterProgresso() { return pendente('Desafio.obterProgresso'); }
  // + adicionarMensagem(texto : char, autor : E-Usuario) : void
  adicionarMensagem(texto, autor) { return pendente('Desafio.adicionarMensagem'); }
}
