// E-Conquista (DC-ENTIDADE) — parte da E-Jornada: conquista (Jornada 1 ◆ 0..*)
// {RN022/RN023: só medalhas e conquistas de manutenção} {RN024: concedida uma única vez, nunca removida}
// Sem operações no diagrama: quem cria e lista é a E-Jornada (verificarConquistas, obterConquistas).

export class Conquista {
  constructor({ id, jornadaId, tipo, nome, diasNecessarios } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;           // composição com a jornada
    this.tipo = tipo;                     // TipoConquista
    this.nome = nome;                     // char
    this.diasNecessarios = diasNecessarios; // int
  }
}
