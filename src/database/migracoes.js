// Cria/atualiza o banco ao abrir o app (usado no onInit do <SQLiteProvider> em App.js).
// Para mudar a estrutura: crie SCHEMA_V2 em schema.js e um novo passo aqui.
// Nunca edite o SCHEMA_V1 depois que alguém da equipe já rodou o app.
import { SCHEMA_V1, VERSAO_SCHEMA } from './schema';

export async function migrarBanco(db) {
  const linha = await db.getFirstAsync('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_SCHEMA) return;

  if (versao === 0) {
    await db.execAsync(SCHEMA_V1);
    versao = 1;
  }
  // if (versao === 1) { await db.execAsync(SCHEMA_V2); versao = 2; }

  await db.execAsync(`PRAGMA user_version = ${VERSAO_SCHEMA}`);
}
