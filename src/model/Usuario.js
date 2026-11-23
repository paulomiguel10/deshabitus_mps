// E-Usuario (DC-ENTIDADE)
// {RN01: email único} {RN03: cadastro só com aceiteTermos = true}
// Associações: possui (1 ◆ 0..*) E-Jornada · convidado/remetente (1 — 0..*) E-Convite
//              participa (1..* — 0..*) E-Desafio · cria (0..1 — 0..*) E-Desafio · autor (1 — 0..*) E-Mensagem
// ATENÇÃO (RNF04 / ADR-005): o atributo senha NÃO é gravado no SQLite.
// A senha vai só para o Firebase Authentication, que guarda o hash.
import { pendente } from '../utils/pendente';
import { buscarUm } from '../database/banco';

export class Usuario {
  constructor({ id, nome, email, senha = null, aceiteTermos = false, dataAceiteTermos = null, notificacoesAtivas = false } = {}) {
    this.id = id;                                   // uid do Firebase Auth
    this.nome = nome;                               // char
    this.email = email;                             // char
    this.senha = senha;                             // char – só em memória, nunca persistida
    this.aceiteTermos = aceiteTermos;               // boolean
    this.dataAceiteTermos = dataAceiteTermos;       // int (ms)
    this.notificacoesAtivas = notificacoesAtivas;   // boolean
  }

  // + existeEmail(email : char) : boolean
  static existeEmail(email) { return pendente('Usuario.existeEmail'); }
  // + autenticar(email : char, senha : char) : E-Usuario
  static autenticar(email, senha) { return pendente('Usuario.autenticar'); }
  // + buscarPorEmail(email : char) : E-Usuario
  static buscarPorEmail(email) { return pendente('Usuario.buscarPorEmail'); }
  // + recuperarSenha() : void
  recuperarSenha() { return pendente('Usuario.recuperarSenha'); }
  // + atualizarDados(nome : char, email : char) : void
  atualizarDados(nome, email) { return pendente('Usuario.atualizarDados'); }
  // + excluirConta() : void  (RN04)
  excluirConta() { return pendente('Usuario.excluirConta'); }
  // + possuiJornadaAtiva() : boolean  (RN05)
  async possuiJornadaAtiva() {
    const linha = await buscarUm('SELECT 1 FROM jornada WHERE usuarioId = ? AND ativa = 1', this.id);
    return linha !== null;
  }
  // + criarJornada(nome, consumoDiario : int, custoUnitario : double, tempoMedioConsumo : int, dataInicio : int, metaDias : int, modo : ModoDesabituacao) : E-Jornada
  criarJornada(nome, consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio, metaDias, modo) {
    return pendente('Usuario.criarJornada');
  }
  // + criarDesafio(nome : char) : E-Desafio
  criarDesafio(nome) { return pendente('Usuario.criarDesafio'); }
  // + obterDiasProgresso() : int  (RN012: o que o grupo vê)
  obterDiasProgresso() { return pendente('Usuario.obterDiasProgresso'); }
  // + definirNotificacoes(ativas : boolean) : void  (RN025)
  definirNotificacoes(ativas) { return pendente('Usuario.definirNotificacoes'); }
  // + possuiNotificacoesAtivas() : boolean
  possuiNotificacoesAtivas() { return this.notificacoesAtivas; }
}
