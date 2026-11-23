// E-Usuario
// {RN01: e-mail único} {RN03: cadastro só com aceiteTermos = true}
// {RN04: ao excluir a conta, removerUsuario() tira o usuário do desafio e apaga seus convites e mensagens}
// A senha NÃO é guardada no SQLite: fica no Firebase Authentication, com hash (RNF04 / ADR-005).
import { pendente } from '../utils/pendente';

export class Usuario {
  constructor({ id, nome, email, aceiteTermos = false, dataAceiteTermos = null, notificacoesAtivas = false } = {}) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.aceiteTermos = aceiteTermos;
    this.dataAceiteTermos = dataAceiteTermos;
    this.notificacoesAtivas = notificacoesAtivas;
  }

  static existeEmail(email) { return pendente('Usuario.existeEmail'); }
  static autenticar(email, senha) { return pendente('Usuario.autenticar'); }
  static buscarPorEmail(email) { return pendente('Usuario.buscarPorEmail'); }
  static recuperarSenha(email) { return pendente('Usuario.recuperarSenha'); }
  atualizarDados(dados) { return pendente('Usuario.atualizarDados'); }
  excluirConta() { return pendente('Usuario.excluirConta'); }
  possuiJornadaAtiva() { return pendente('Usuario.possuiJornadaAtiva'); }
  obterDiasProgresso() { return pendente('Usuario.obterDiasProgresso'); }
  definirNotificacoes(ativas) { return pendente('Usuario.definirNotificacoes'); }
  possuiNotificacoesAtivas() { return this.notificacoesAtivas; }
}
