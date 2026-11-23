// C-ConfigurarNotificacoes — UC08 – Gerenciar notificações motivacionais
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';

export const ConfigurarNotificacoes = {
  alterarNotificacoes(ativas) {
    return pendente('ConfigurarNotificacoes.alterarNotificacoes');
  },
  agendarNotificacoes() {
    return pendente('ConfigurarNotificacoes.agendarNotificacoes');
  },
  cancelarNotificacoes() {
    return pendente('ConfigurarNotificacoes.cancelarNotificacoes');
  },
  enviarNotificacao() {
    return pendente('ConfigurarNotificacoes.enviarNotificacao');
  },
  aparelhoBloqueado() {
    return pendente('ConfigurarNotificacoes.aparelhoBloqueado');
  },
};
