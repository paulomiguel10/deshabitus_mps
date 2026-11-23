// C-GerenciarDesafios — UC04 – Gerenciar desafios em grupo (exige internet)
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';
import { verificarConexao } from '../services/conexao';

export const GerenciarDesafios = {
  acessarDesafio() {
    return pendente('GerenciarDesafios.acessarDesafio');
  },
  criarDesafio(nome) {
    return pendente('GerenciarDesafios.criarDesafio');
  },
  convidarParticipante(desafio, email) {
    return pendente('GerenciarDesafios.convidarParticipante');
  },
  aceitarConvite(convite) {
    return pendente('GerenciarDesafios.aceitarConvite');
  },
  consultarGrupo(desafio) {
    return pendente('GerenciarDesafios.consultarGrupo');
  },
  enviarMensagem(desafio, texto) {
    return pendente('GerenciarDesafios.enviarMensagem');
  },
  verificarConexao,
};
