// E-Mensagem (DC-ENTIDADE) — Firestore
// Associações: E-Desafio contem (1 — 0..*) · E-Usuario autor (1 — 0..*)
export class Mensagem {
  constructor({ id, desafioId, autorId, texto } = {}) {
    this.id = id;
    this.desafioId = desafioId;
    this.autorId = autorId;
    this.texto = texto; // char
  }
}
