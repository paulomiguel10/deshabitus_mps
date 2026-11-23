// Estado compartilhado pelas telas (F-): quem está logado e qual é a jornada ativa.
// Não é uma classe do diagrama: é a "cola" da camada View do React.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseConfigurado } from '../services/firebase';
import { Usuario } from '../model/Usuario';
import { buscarUm, paraBoolean } from '../database/banco';
import { carregarJornadaAtiva } from '../database/consultas';

const SessaoContext = createContext(null);

// Monta o E-Usuario a partir do Firebase Auth + dados locais (se já existirem no aparelho)
async function montarUsuario(usuarioFirebase) {
  const linha = await buscarUm('SELECT * FROM usuario WHERE id = ?', usuarioFirebase.uid);
  return new Usuario({
    id: usuarioFirebase.uid,
    nome: linha?.nome ?? usuarioFirebase.displayName ?? '',
    email: linha?.email ?? usuarioFirebase.email,
    aceiteTermos: paraBoolean(linha?.aceiteTermos),
    dataAceiteTermos: linha?.dataAceiteTermos ?? null,
    notificacoesAtivas: paraBoolean(linha?.notificacoesAtivas),
  });
}

export function SessaoProvider({ children }) {
  // Sem Firebase configurado não há sessão para esperar
  const [carregando, setCarregando] = useState(firebaseConfigurado);
  const [usuario, setUsuario] = useState(null);   // E-Usuario ou null
  const [jornada, setJornada] = useState(null);   // E-Jornada ativa ou null

  const recarregarJornada = useCallback(async (u = usuario) => {
    setJornada(u ? await carregarJornadaAtiva(u.id) : null);
  }, [usuario]);

  // Relê o usuário logado (depois do cadastro ou de alterar o perfil)
  const recarregarUsuario = useCallback(async () => {
    const u = auth?.currentUser ? await montarUsuario(auth.currentUser) : null;
    setUsuario(u);
    return u;
  }, []);

  useEffect(() => {
    if (!firebaseConfigurado) return undefined;
    // Chamado ao abrir o app (sessão salva) e a cada login/logout
    return onAuthStateChanged(auth, async (usuarioFirebase) => {
      const u = usuarioFirebase ? await montarUsuario(usuarioFirebase) : null;
      setUsuario(u);
      setJornada(u ? await carregarJornadaAtiva(u.id) : null);
      setCarregando(false);
    });
  }, []);

  return (
    <SessaoContext.Provider value={{ carregando, usuario, recarregarUsuario, jornada, recarregarJornada }}>
      {children}
    </SessaoContext.Provider>
  );
}

export const useSessao = () => useContext(SessaoContext);
