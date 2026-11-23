// E-Usuario (DC-ENTIDADE)
// {RN01: email único} {RN03: cadastro só com aceiteTermos = true}
// Associações: possui (1 ◆ 0..*) E-Jornada · convidado/remetente (1 — 0..*) E-Convite
//              participa (1..* — 0..*) E-Desafio · cria (0..1 — 0..*) E-Desafio · autor (1 — 0..*) E-Mensagem
// ATENÇÃO (RNF04 / ADR-005): o atributo senha NÃO é gravado no SQLite nem no Firestore.
// Ela vai só para o Firebase Authentication, que guarda o hash.
import { deleteUser, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth';
import { pendente } from '../utils/pendente';
import { buscarUm, executar, paraBoolean } from '../database/banco';
import { gravarUsuarioLocal } from '../database/consultas';
import { auth, traduzirErroFirebase } from '../services/firebase';
import { apagarDadosDoUsuario } from '../services/nuvem';
import { ErroNegocio } from '../utils/erros';

const deLinha = (linha) =>
  new Usuario({
    ...linha,
    aceiteTermos: paraBoolean(linha.aceiteTermos),
    notificacoesAtivas: paraBoolean(linha.notificacoesAtivas),
  });

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
  // Verifica no aparelho. A unicidade em todo o sistema (RN01) é garantida pelo Firebase Auth no cadastro.
  static async existeEmail(email) {
    return (await buscarUm('SELECT 1 FROM usuario WHERE email = ?', email.trim().toLowerCase())) !== null;
  }

  // + autenticar(email : char, senha : char) : E-Usuario
  static async autenticar(email, senha) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), senha);
      const local = await Usuario.buscarPorEmail(user.email);
      const usuario = local ?? new Usuario({ id: user.uid, nome: user.displayName ?? '', email: user.email });
      await gravarUsuarioLocal(usuario); // 1º login neste aparelho
      // TODO (Fase 5): em aparelho novo, baixar o histórico do Firestore (RF01: nada se perde)
      return usuario;
    } catch (erro) {
      throw new ErroNegocio(traduzirErroFirebase(erro));
    }
  }

  // + buscarPorEmail(email : char) : E-Usuario
  static async buscarPorEmail(email) {
    const linha = await buscarUm('SELECT * FROM usuario WHERE email = ?', email.trim().toLowerCase());
    return linha ? deLinha(linha) : null;
  }

  // + recuperarSenha() : void
  async recuperarSenha() {
    try {
      await sendPasswordResetEmail(auth, this.email.trim().toLowerCase());
    } catch (erro) {
      throw new ErroNegocio(traduzirErroFirebase(erro));
    }
  }

  // + atualizarDados(nome : char, email : char) : void
  // A troca de e-mail só vale depois que o usuário confirma o link enviado para o novo endereço.
  async atualizarDados(nome, email) {
    try {
      const novoEmail = email.trim().toLowerCase();
      await updateProfile(auth.currentUser, { displayName: nome.trim() });
      await executar('UPDATE usuario SET nome = ? WHERE id = ?', nome.trim(), this.id);
      this.nome = nome.trim();
      if (novoEmail !== this.email) await verifyBeforeUpdateEmail(auth.currentUser, novoEmail);
    } catch (erro) {
      throw new ErroNegocio(traduzirErroFirebase(erro));
    }
  }

  // + excluirConta() : void
  // {RN04: ao excluir a conta, removerUsuario() tira o usuário do desafio e apaga seus convites e mensagens}
  async excluirConta() {
    try {
      // TODO (UC04): para cada desafio do usuário, chamar Desafio.removerUsuario(this)
      await apagarDadosDoUsuario(this.id);  // cópia na nuvem
      await deleteUser(auth.currentUser);   // conta no Firebase Auth
      await executar('DELETE FROM usuario WHERE id = ?', this.id); // aparelho (composições apagam em cascata)
    } catch (erro) {
      throw new ErroNegocio(traduzirErroFirebase(erro));
    }
  }

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
