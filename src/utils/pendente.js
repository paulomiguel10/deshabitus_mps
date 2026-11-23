// Marca métodos do diagrama que ainda não foram implementados.
// Se alguém chamar sem implementar, o erro diz exatamente qual método falta.
export function pendente(metodo) {
  throw new Error(`TODO: implementar ${metodo} (ver diagrama no Astah)`);
}
