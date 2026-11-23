// Padrão Strategy para o modo de desabituação (ADR-010, RN09).
// TODA tela, widget ou notificação que mostra progresso deve passar por aqui,
// nunca formatar números direto. Assim o modo cego vale no app inteiro.
import { ModoDesabituacao } from '../model/enums';

const moeda = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const modoPadrao = {
  mostraMetricas: true,
  dias: (n) => `${n} ${n === 1 ? 'dia' : 'dias'}`,
  dinheiro: (v) => moeda(v),
  tempo: (min) => (min >= 60 ? `${Math.floor(min / 60)} h ${Math.round(min % 60)} min` : `${Math.round(min)} min`),
  progresso: (dias, proximoMarco) => `${dias} de ${proximoMarco} dias`,
};

const modoCego = {
  mostraMetricas: false,
  dias: () => 'Você está no caminho',
  dinheiro: () => 'Oculto no modo cego',
  tempo: () => 'Oculto no modo cego',
  progresso: () => 'Continue, um dia de cada vez',
};

export function obterModoExibicao(modo) {
  return modo === ModoDesabituacao.CEGO ? modoCego : modoPadrao;
}
