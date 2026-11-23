// Conexão única com o SQLite (ADR-003) e funções de apoio usadas pelas entidades (E-).
// Padrão de persistência da equipe:
//   - As entidades NÃO escrevem SQL solto: usam as funções daqui.
//   - As colunas têm o mesmo nome dos atributos do diagrama, então uma linha vira objeto direto:
//       new Gatilho(linha)
//   - boolean do diagrama é guardado como 0/1: use paraBoolean()/deBoolean() na conversão.
import { openDatabaseSync } from 'expo-sqlite';
import { migrarBanco } from './migracoes';

const NOME_BANCO = 'deshabitus.db';
let banco = null;

// Abre o banco (uma vez só) e cria/atualiza as tabelas. Chamado em App.js ao iniciar.
export async function iniciarBanco() {
  if (!banco) banco = openDatabaseSync(NOME_BANCO);
  await migrarBanco(banco);
  return banco;
}

export function obterBanco() {
  if (!banco) throw new Error('Banco não iniciado: chame iniciarBanco() em App.js antes de usar as entidades.');
  return banco;
}

// SELECT de várias linhas
export const buscarTodos = (sql, ...params) => obterBanco().getAllAsync(sql, ...params);

// SELECT de uma linha (ou null)
export const buscarUm = (sql, ...params) => obterBanco().getFirstAsync(sql, ...params);

// INSERT / UPDATE / DELETE
export const executar = (sql, ...params) => obterBanco().runAsync(sql, ...params);

// Várias operações que precisam dar certo juntas (ex.: criar Jornada + Habito)
export const emTransacao = (tarefa) => obterBanco().withTransactionAsync(tarefa);

// boolean do diagrama <-> INTEGER do SQLite
export const paraBoolean = (valor) => valor === 1 || valor === true;
export const deBoolean = (valor) => (valor ? 1 : 0);
