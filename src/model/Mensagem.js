// E-Mensagem — Firestore
export class Mensagem {
  constructor({ id, desafioId, autorId, texto } = {}) {
    this.id = id;
    this.desafioId = desafioId;
    this.autorId = autorId;
    this.texto = texto;
  }
}
