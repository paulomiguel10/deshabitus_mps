// Banco local SQLite (ADR-003). Tabelas = entidades do DC-ENTIDADE que ficam no aparelho.
// Nomes de colunas iguais aos atributos do diagrama.
// Padrões de todas as tabelas:
//   id TEXT -> UUID gerado no aparelho (evita duplicar na sincronização, RN29)
//   sincronizado INTEGER -> 0 = ainda não foi enviado ao Firestore
//   atualizadoEm TEXT -> data/hora ISO da última alteração (vale a mais recente)
// E-Desafio, E-Convite e E-Mensagem NÃO ficam aqui: só existem online, no Firestore.

export const VERSAO_SCHEMA = 1;

export const SCHEMA_V1 = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuario (            -- E-Usuario (senha fica no Firebase Auth)
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,                     -- RN01
  aceiteTermos INTEGER NOT NULL DEFAULT 0,        -- RN03
  dataAceiteTermos TEXT,
  notificacoesAtivas INTEGER NOT NULL DEFAULT 0,  -- RN25
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS habito (             -- E-Habito
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  consumoDiario REAL NOT NULL,                    -- RN06
  custoUnitario REAL NOT NULL,                    -- RN06
  tempoMedioConsumo REAL NOT NULL,                -- RN08 (minutos)
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jornada (            -- E-Jornada
  id TEXT PRIMARY KEY NOT NULL,
  usuarioId TEXT NOT NULL REFERENCES usuario(id),
  habitoId TEXT NOT NULL REFERENCES habito(id),
  dataInicio TEXT NOT NULL,                       -- RN07
  dataUltimoReinicio TEXT,                        -- RN19
  metaDias INTEGER,
  ativa INTEGER NOT NULL DEFAULT 1,               -- RN05 / RN30
  modo TEXT NOT NULL DEFAULT 'PADRAO' CHECK (modo IN ('PADRAO', 'CEGO')),
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL
);
-- RN05: no máximo 1 jornada ativa por usuário (garantido pelo próprio banco)
CREATE UNIQUE INDEX IF NOT EXISTS idx_uma_jornada_ativa ON jornada(usuarioId) WHERE ativa = 1;

CREATE TABLE IF NOT EXISTS gatilho (            -- E-Gatilho
  id TEXT PRIMARY KEY NOT NULL,
  descricao TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS registroTentacao (   -- E-RegistroTentacao
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id),
  gatilhoId TEXT NOT NULL REFERENCES gatilho(id), -- motivadoPor
  dataHora TEXT NOT NULL,                         -- RN15 / RN29
  motivoLivre TEXT,                               -- RN17
  observacao TEXT,
  resultado TEXT NOT NULL CHECK (resultado IN ('RESISTIU', 'RECAIU')),
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS checkInEsforco (     -- E-CheckInEsforco
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id),
  data TEXT NOT NULL,                             -- AAAA-MM-DD
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 5), -- RN21
  observacao TEXT,
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL,
  UNIQUE (jornadaId, data)                        -- RN21: 1 por dia
);

CREATE TABLE IF NOT EXISTS conquista (          -- E-Conquista (catálogo)
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('MEDALHA', 'MANUTENCAO')),
  diasNecessarios INTEGER NOT NULL
);

-- Associação Jornada <-> Conquista (conquistas obtidas). RN24: concedida uma única vez.
CREATE TABLE IF NOT EXISTS jornadaConquista (
  id TEXT PRIMARY KEY NOT NULL,
  jornadaId TEXT NOT NULL REFERENCES jornada(id),
  conquistaId TEXT NOT NULL REFERENCES conquista(id),
  diasAtingidos INTEGER NOT NULL,                 -- RN23: manutenção se repete a cada 30 dias
  dataObtencao TEXT NOT NULL,
  sincronizado INTEGER NOT NULL DEFAULT 0,
  atualizadoEm TEXT NOT NULL,
  UNIQUE (jornadaId, conquistaId, diasAtingidos)
);

-- Dados fixos (RN16, RN22, RN23)
INSERT OR IGNORE INTO gatilho (id, descricao) VALUES
  ('estresse', 'Estresse'), ('pos-refeicao', 'Pós-refeição'), ('tedio', 'Tédio'),
  ('trabalho', 'Trabalho'), ('situacao-social', 'Situação social'), ('cansaco', 'Cansaço'),
  ('outro', 'Outro');

INSERT OR IGNORE INTO conquista (id, nome, tipo, diasNecessarios) VALUES
  ('bronze', 'Bronze', 'MEDALHA', 60), ('prata', 'Prata', 'MEDALHA', 90),
  ('ouro', 'Ouro', 'MEDALHA', 120), ('diamante', 'Diamante', 'MEDALHA', 150),
  ('manutencao', 'Conquista de manutenção', 'MANUTENCAO', 30);
`;
