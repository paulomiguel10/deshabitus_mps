// Sessão do usuário (infraestrutura, como o firebase.js): quem está logado e qual a jornada ativa.
// Não é caso de uso do diagrama; existe para a camada View não acessar banco nem Firebase direto.
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseConfigurado } from './firebase';
import { Usuario } from '../model/Usuario';
import { buscarUm, paraBoolean } from '../database/banco';
import { carregarJornadaAtiva, gravarUsuarioLocal } from '../database/consultas';

// Monta o E-Usuario a partir do Firebase Auth + dados do aparelho
async function montarUsuario(usuarioFirebase) {
  const linha = await buscarUm('SELECT * FROM usuario WHERE id = ?', usuarioFirebase.uid);
  const usuario = new Usuario({
    id: usuarioFirebase.uid,
    nome: linha?.nome ?? usuarioFirebase.displayName ?? '',
    email: linha?.email ?? usuarioFirebase.email,
    aceiteTermos: paraBoolean(linha?.aceiteTermos),
    dataAceiteTermos: linha?.dataAceiteTermos ?? null,
    notificacoesAtivas: paraBoolean(linha?.notificacoesAtivas),
  });
  // Sessão salva, mas o usuário ainda não existe neste banco: grava (a jornada depende dele)
  if (!linha) await gravarUsuarioLocal(usuario);
  return usuario;
}

// Avisa a cada login/logout (e ao abrir o app com a sessão salva). Retorna a função que para de observar.
export function observarSessao(aoMudar) {
  if (!firebaseConfigurado) return () => {};
  return onAuthStateChanged(auth, async (usuarioFirebase) => {
    aoMudar(usuarioFirebase ? await montarUsuario(usuarioFirebase) : null);
  });
}

export async function carregarUsuarioLogado() {
  return auth?.currentUser ? montarUsuario(auth.currentUser) : null;
}

export const carregarJornada = (usuario) => (usuario ? carregarJornadaAtiva(usuario.id) : Promise.resolve(null));
