// Consultas de apoio que NÃO são operações do DC-ENTIDADE.
// ATENÇÃO: o diagrama não tem uma operação que devolva a jornada ativa do usuário
// (só possuiJornadaAtiva(): boolean). A sessão precisa do objeto Jornada, então ele é
// carregado aqui. Sugestão para o Astah: incluir em E-Usuario "+ obterJornadaAtiva() : E-Jornada"
// e mover esta consulta para lá.
import { buscarUm, paraBoolean } from './banco';
import { Jornada } from '../model/Jornada';

export async function carregarJornadaAtiva(usuarioId) {
  const linha = await buscarUm('SELECT * FROM jornada WHERE usuarioId = ? AND ativa = 1', usuarioId);
  return linha ? new Jornada({ ...linha, ativa: paraBoolean(linha.ativa) }) : null;
}
