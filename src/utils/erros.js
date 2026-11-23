// Erro de regra de negócio: a mensagem é mostrada direto para o usuário na tela.
export class ErroNegocio extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroNegocio';
  }
}
