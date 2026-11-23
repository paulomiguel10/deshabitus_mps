// Estado compartilhado pelas telas (F-): quem está logado e qual é a jornada ativa.
// Não é uma classe do diagrama: é a "cola" da camada View do React.
// Não acessa banco nem Firebase: usa o serviço de sessão (services/sessao.js).
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { firebaseConfigurado } from '../services/firebase';
import { carregarJornada, carregarUsuarioLogado, observarSessao } from '../services/sessao';

const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {
  // Sem Firebase configurado não há sessão para esperar
  const [carregando, setCarregando] = useState(firebaseConfigurado);
  const [usuario, setUsuario] = useState(null);   // E-Usuario ou null
  const [jornada, setJornada] = useState(null);   // E-Jornada ativa ou null

  const recarregarJornada = useCallback(async (u = usuario) => {
    setJornada(await carregarJornada(u));
  }, [usuario]);

  // Relê o usuário logado (depois do cadastro ou de alterar o perfil)
  const recarregarUsuario = useCallback(async () => {
    const u = await carregarUsuarioLogado();
    setUsuario(u);
    return u;
  }, []);

  useEffect(
    () =>
      observarSessao(async (u) => {
        setUsuario(u);
        setJornada(await carregarJornada(u));
        setCarregando(false);
      }),
    []
  );

  return (
    <SessaoContext.Provider value={{ carregando, usuario, recarregarUsuario, jornada, recarregarJornada }}>
      {children}
    </SessaoContext.Provider>
  );
}

export const useSessao = () => useContext(SessaoContext);
