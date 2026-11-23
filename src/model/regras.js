// Valores fixos das regras de negócio em um só lugar (ADR-010)
export const MARCOS_DIAS = [5, 10, 20, 40, 60]; // RN022: calculados pelos dias consecutivos, não armazenados
export const MEDALHAS = [                        // RN022: medalhas (E-Conquista tipo MEDALHA)
  { nome: 'Bronze', diasNecessarios: 60 },
  { nome: 'Prata', diasNecessarios: 90 },
  { nome: 'Ouro', diasNecessarios: 120 },
  { nome: 'Diamante', diasNecessarios: 150 },
];
export const INTERVALO_MANUTENCAO = 30;          // RN023: E-Conquista tipo MANUTENCAO a cada 30 dias após 150
export const NIVEL_ESFORCO = { MIN: 1, MAX: 5 }; // RN021
