// C-CadastrarHabito — UC02 – Cadastrar hábito e metas
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';

export const CadastrarHabito = {
  iniciarCadastroHabito() {
    return pendente('CadastrarHabito.iniciarCadastroHabito');
  },
  informarHabito(nome) {
    return pendente('CadastrarHabito.informarHabito');
  },
  informarDadosConsumo(consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio) {
    return pendente('CadastrarHabito.informarDadosConsumo');
  },
  definirMeta(metaDias) {
    return pendente('CadastrarHabito.definirMeta');
  },
  registrarHabito() {
    return pendente('CadastrarHabito.registrarHabito');
  },
};
