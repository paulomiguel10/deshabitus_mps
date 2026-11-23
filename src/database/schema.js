// Banco local SQLite (ADR-003) = entidades do DC-ENTIDADE que ficam no aparelho.
// Colunas = atributos do diagrama, com os mesmos nomes. Além deles, só o necessário para implementar:
//   id TEXT            -> identidade do objeto (UUID gerado no aparelho, RN029)
//   <dono>Id TEXT      -> composições (◆) e associações do diagrama viram chave estrangeira
// Tipos: char -> TEXT · int -> INTEGER · double -> REAL · boolean -> INTEGER (0/1) · enum -> TEXT
// Datas int: AAAAMMDD (sem hora) ou milissegundos (com hora) – ver src/utils/datas.js
// E-Desafio, E-Convite e E-Mensagem NÃO ficam aqui: só existem no Firestore (exigem internet).
// A senha do E-Usuario NÃO fica aqui: vai para o Firebase Authentication (RNF04 / ADR-005).

export const VERSAO_SCHEMA = 1;

export const SCHEMA_V1 = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- E-Usuario
CREATE TABLE IF NOT EXISTS usuario (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,                      -- RN01
  aceiteTermos INTEGER NOT NULL DEFAULT 0,         -- RN03
  dataAceiteTermos INTEGER,
  notificacoesAtivas INTEGER NOT NULL DEFAULT 0    -- RN025
);

-- E-Jornada  (E-Usuario 1 ◆ possui 0..* E-Jornada)
CREATE TABLE IF NOT EXISTS jornada (
  id TEXT PRIMARY KEY NOT NULL,
  usuarioId TEXT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  dataInicio INTEGER NOT NULL,                     -- RN07
  dataUltimoReinicio INTEGER,                      -- RN019
  metaDias INTEGER,                                -- [0..1]
  modo TEXT NOT NULL DEFAULT 'PADRAO' CHECK (modo IN ('PADRAO', 'CEGO')),
  ativa INTEGER NOT NULL DEFAULT 1
);
-- RN05: no máximo 1 jornada ativa por usuário (garantido pelo próprio banco)
CREATE UNIQUE INDEX IF NOT EXISTS idx_uma_jornada_ativa ON jornada(usuarioId) WHERE ativa = 1;

-- E-Habito  (E-Jornada 1 ◆ acompanha 1 E-Habito)
CREATE TABLE IF NOT EXISTS habito (
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL UNIQUE REFERENCES jornada(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  consumoDiario INTEGER NOT NULL,
  custoUnitario REAL NOT NULL,
  tempoMedioConsumo INTEGER NOT NULL
);

-- E-Gatilho
CREATE TABLE IF NOT EXISTS gatilho (
  id TEXT PRIMARY KEY NOT NULL,
  descricao TEXT NOT NULL UNIQUE
);

-- E-RegistroTentacao  (E-Jornada 1 ◆ registra 0..*) (motivadoPor 0..1 E-Gatilho)
CREATE TABLE IF NOT EXISTS registroTentacao (
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id) ON DELETE CASCADE,
  gatilhoId TEXT REFERENCES gatilho(id),           -- 0..1 (RN016)
  dataHora INTEGER NOT NULL,                       -- RN015
  resultado TEXT NOT NULL CHECK (resultado IN ('RESISTIU', 'RECAIU')),
  motivoLivre TEXT,                                -- [0..1] (RN016)
  observacao TEXT,                                 -- [0..1]
  sincronizado INTEGER NOT NULL DEFAULT 0          -- RN029
);

-- E-CheckInEsforco  (E-Jornada 1 ◆ registra 0..*)
CREATE TABLE IF NOT EXISTS checkInEsforco (
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id) ON DELETE CASCADE,
  data INTEGER NOT NULL,                           -- AAAAMMDD
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 5), -- RN021
  observacao TEXT,                                 -- [0..1]
  sincronizado INTEGER NOT NULL DEFAULT 0,         -- RN029
  UNIQUE (jornadaId, data)                         -- RN021: um check-in por dia
);

-- E-Conquista  (E-Jornada 1 ◆ conquista 0..*)
CREATE TABLE IF NOT EXISTS conquista (
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('MEDALHA', 'MANUTENCAO')),
  nome TEXT NOT NULL,
  diasNecessarios INTEGER NOT NULL,
  UNIQUE (jornadaId, tipo, diasNecessarios)        -- RN024: concedida uma única vez
);

-- Dados iniciais de E-Gatilho (lista de motivos do documento, RN016)
INSERT OR IGNORE INTO gatilho (id, descricao) VALUES
  ('estresse', 'Estresse'), ('pos-refeicao', 'Pós-refeição'), ('tedio', 'Tédio'),
  ('trabalho', 'Trabalho'), ('situacao-social', 'Situação social'), ('cansaco', 'Cansaço');
`;
