// C-GerenciarConta — UC01 – Gerenciar conta e perfil
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';
import { verificarConexao } from '../services/conexao';

export const GerenciarConta = {
  cadastrarConta(nome, email, senha, aceiteTermos) {
    return pendente('GerenciarConta.cadastrarConta');
  },
  fazerLogin(email, senha) {
    return pendente('GerenciarConta.fazerLogin');
  },
  recuperarSenha(email) {
    return pendente('GerenciarConta.recuperarSenha');
  },
  atualizarPerfil(dados) {
    return pendente('GerenciarConta.atualizarPerfil');
  },
  excluirConta() {
    return pendente('GerenciarConta.excluirConta');
  },
  verificarConexao,
};
