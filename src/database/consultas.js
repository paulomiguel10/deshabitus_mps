// Consultas de apoio que NÃO são operações do DC-ENTIDADE.
import { buscarUm, executar, paraBoolean, deBoolean } from './banco';
import { Jornada } from '../model/Jornada';

// LACUNA NO DIAGRAMA: não há operação que devolva a jornada ativa (só possuiJornadaAtiva(): boolean).
// Sugestão para o Astah: "+ obterJornadaAtiva() : E-Jornada" em E-Usuario.
export async function carregarJornadaAtiva(usuarioId) {
  const linha = await buscarUm('SELECT * FROM jornada WHERE usuarioId = ? AND ativa = 1', usuarioId);
  return linha ? new Jornada({ ...linha, ativa: paraBoolean(linha.ativa) }) : null;
}

// LACUNA NO DIAGRAMA: E-Usuario não tem operação para gravar um usuário novo.
// O cadastro (C-GerenciarConta.cadastrarConta) e o 1º login num aparelho usam esta função.
// Se o usuário já existe no aparelho: atualiza nome e email; o aceite (RN03) só pode passar de
// "não" para "sim" (a sessão do Firebase às vezes grava o usuário antes do cadastro terminar).
// Notificações são mantidas. A senha nunca é gravada aqui (RNF04).
export function gravarUsuarioLocal(usuario) {
  return executar(
    `INSERT INTO usuario (id, nome, email, aceiteTermos, dataAceiteTermos, notificacoesAtivas)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       nome = excluded.nome,
       email = excluded.email,
       aceiteTermos = MAX(aceiteTermos, excluded.aceiteTermos),
       dataAceiteTermos = COALESCE(dataAceiteTermos, excluded.dataAceiteTermos)`,
    usuario.id, usuario.nome, usuario.email, deBoolean(usuario.aceiteTermos),
    usuario.dataAceiteTermos, deBoolean(usuario.notificacoesAtivas)
  );
}
