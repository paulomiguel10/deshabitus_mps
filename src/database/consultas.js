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
// Se o usuário já existe no aparelho, só nome e email são atualizados (aceite e notificações são mantidos).
// A senha nunca é gravada aqui (RNF04).
export function gravarUsuarioLocal(usuario) {
  return executar(
    `INSERT INTO usuario (id, nome, email, aceiteTermos, dataAceiteTermos, notificacoesAtivas)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET nome = excluded.nome, email = excluded.email`,
    usuario.id, usuario.nome, usuario.email, deBoolean(usuario.aceiteTermos),
    usuario.dataAceiteTermos, deBoolean(usuario.notificacoesAtivas)
  );
}
