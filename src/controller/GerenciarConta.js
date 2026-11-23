// C-GerenciarConta — UC01 Gerenciar conta e perfil (VCP01)
// Controller: recebe as ações da F-TelaConta e aplica as regras usando o E-Usuario.
// Cadastro, login, recuperação de senha, alteração e exclusão exigem internet (RNF10).
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Usuario } from '../model/Usuario';
import { gravarUsuarioLocal } from '../database/consultas';
import { auth, firebaseConfigurado, traduzirErroFirebase } from '../services/firebase';
import { verificarConexao } from '../services/conexao';
import { ErroNegocio } from '../utils/erros';
import { agora } from '../utils/datas';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function exigirConexao(acao) {
  if (!firebaseConfigurado) {
    throw new ErroNegocio('Firebase não configurado neste computador: crie o arquivo .env (TUTORIAL.md, seção 4).');
  }
  if (!(await verificarConexao())) {
    throw new ErroNegocio(`Sem internet. ${acao} precisa de conexão; o resto do app funciona offline.`);
  }
}

function validarNomeEmail(nome, email) {
  if (!nome?.trim() || !email?.trim()) throw new ErroNegocio('Preencha nome e e-mail.');
  if (!EMAIL_VALIDO.test(email.trim())) throw new ErroNegocio('E-mail inválido.');
}

export const GerenciarConta = {
  verificarConexao,

  // cadastrarConta(nome, email, senha, aceiteTermos) : E-Usuario
  async cadastrarConta(nome, email, senha, aceiteTermos) {
    validarNomeEmail(nome, email);
    if (!senha || senha.length < 6) throw new ErroNegocio('A senha precisa ter pelo menos 6 caracteres.');
    if (!aceiteTermos) throw new ErroNegocio('Para criar a conta, aceite os termos de uso e o tratamento dos seus dados.'); // RN03
    await exigirConexao('O cadastro');
    if (await Usuario.existeEmail(email)) throw new ErroNegocio('Este e-mail já tem uma conta.'); // RN01

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), senha); // RN01 no servidor
      await updateProfile(user, { displayName: nome.trim() });
      const usuario = new Usuario({
        id: user.uid,
        nome: nome.trim(),
        email: user.email,
        aceiteTermos: true,
        dataAceiteTermos: agora(), // RN03: data do aceite
      });
      await gravarUsuarioLocal(usuario);
      return usuario;
    } catch (erro) {
      throw new ErroNegocio(traduzirErroFirebase(erro));
    }
  },

  // fazerLogin(email, senha) : E-Usuario
  async fazerLogin(email, senha) {
    if (!email?.trim() || !senha) throw new ErroNegocio('Informe e-mail e senha.');
    await exigirConexao('O primeiro login');
    return Usuario.autenticar(email, senha);
  },

  // recuperarSenha(email) : void
  async recuperarSenha(email) {
    if (!email?.trim() || !EMAIL_VALIDO.test(email.trim())) throw new ErroNegocio('Informe um e-mail válido.');
    await exigirConexao('A recuperação de senha');
    await new Usuario({ email }).recuperarSenha();
  },

  // atualizarPerfil(usuario, nome, email) : void
  async atualizarPerfil(usuario, nome, email) {
    validarNomeEmail(nome, email);
    await exigirConexao('A alteração do perfil');
    await usuario.atualizarDados(nome, email);
  },

  // excluirConta(usuario) : void  (RN04)
  async excluirConta(usuario) {
    await exigirConexao('A exclusão da conta');
    await usuario.excluirConta();
  },
};
