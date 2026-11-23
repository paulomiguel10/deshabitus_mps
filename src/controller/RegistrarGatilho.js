// C-RegistrarGatilho — UC06 – Registrar gatilho e recaída
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';

export const RegistrarGatilho = {
  iniciarRegistro() {
    return pendente('RegistrarGatilho.iniciarRegistro');
  },
  alterarDataHora(dataHora) {
    return pendente('RegistrarGatilho.alterarDataHora');
  },
  informarMotivo(gatilho, motivoLivre, observacao) {
    return pendente('RegistrarGatilho.informarMotivo');
  },
  informarResultado(resultado) {
    return pendente('RegistrarGatilho.informarResultado');
  },
  salvarRegistro() {
    return pendente('RegistrarGatilho.salvarRegistro');
  },
  recomecarJornada() {
    return pendente('RegistrarGatilho.recomecarJornada');
  },
  obterGatilhoMaisFrequente() {
    return pendente('RegistrarGatilho.obterGatilhoMaisFrequente');
  },
};
