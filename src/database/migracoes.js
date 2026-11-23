// Cria/atualiza o banco ao abrir o app (chamado por iniciarBanco() em database/banco.js).
// Regra da equipe: NUNCA altere um schema que já foi publicado. Crie uma versão nova
// (SCHEMA_V3...) em schema.js e um passo novo aqui.
import { SCHEMA_V2, TABELAS_V1, VERSAO_SCHEMA } from './schema';

export async function migrarBanco(db) {
  const linha = await db.getFirstAsync('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_SCHEMA) return;

  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = OFF'); // permite recriar tabelas ligadas entre si

  if (versao === 1) {
    // v1 -> v2: estrutura ajustada ao DC-ENTIDADE. Recria tudo.
    for (const tabela of TABELAS_V1) await db.execAsync(`DROP TABLE IF EXISTS ${tabela}`);
    versao = 0;
  }

  if (versao === 0) {
    await db.execAsync(SCHEMA_V2);
    versao = 2;
  }

  // if (versao === 2) { await db.execAsync(SCHEMA_V3); versao = 3; }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_SCHEMA}`);
  await db.execAsync('PRAGMA foreign_keys = ON');
}
