// F-Notificacao — UC08. Notificações locais agendadas no aparelho (ADR-004), texto neutro (RN26).
// TODO: usar expo-notifications (scheduleNotificationAsync) chamado pelo C-ConfigurarNotificacoes.
import { pendente } from '../utils/pendente';

export const Notificacao = {
  exibir(texto) {
    return pendente('Notificacao.exibir');
  },
};
