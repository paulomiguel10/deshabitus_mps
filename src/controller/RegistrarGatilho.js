// C-RegistrarGatilho — UC06 Registrar gatilho e recaída (VCP11: E-Jornada, E-RegistroTentacao, E-Gatilho, E-Conquista)
import { Gatilho } from '../model/Gatilho';
import { Resultado } from '../model/enums';
import { ErroNegocio } from '../utils/erros';
import { agora, hoje } from '../utils/datas';

let rascunho = {};

export const RegistrarGatilho = {
  // iniciarRegistro(resultado?) : { gatilhos, dataHora, resultado }
  // dataHora preenchida automaticamente (RN015); resultado pode vir do SOS (RN028)
  async iniciarRegistro(resultado = null) {
    rascunho = { dataHora: agora(), resultado, gatilho: null, motivoLivre: null, observacao: null };
    return { gatilhos: await Gatilho.listarGatilhos(), dataHora: rascunho.dataHora, resultado };
  },

  // alterarDataHora(dataHora) : void — editável, nunca futura (RN015)
  alterarDataHora(dataHora) {
    if (!dataHora || dataHora > agora()) throw new ErroNegocio('A data e hora não podem ser no futuro.');
    rascunho.dataHora = dataHora;
  },

  // informarMotivo(gatilho, motivoLivre, observacao) : void — todos opcionais (RN016)
  informarMotivo(gatilho, motivoLivre, observacao) {
    Object.assign(rascunho, { gatilho: gatilho ?? null, motivoLivre: motivoLivre ?? null, observacao: observacao ?? null });
  },

  // informarResultado(resultado) : void
  informarResultado(resultado) {
    if (!Object.values(Resultado).includes(resultado)) throw new ErroNegocio('Informe se você resistiu ou recaiu.');
    rascunho.resultado = resultado;
  },

  // salvarRegistro(jornada) : void
  async salvarRegistro(jornada) {
    const { dataHora, resultado, gatilho, motivoLivre, observacao } = rascunho;
    if (!resultado) throw new ErroNegocio('Informe se você resistiu ou recaiu.');
    await jornada.registrarTentacao(dataHora, resultado, gatilho, motivoLivre, observacao);
    await jornada.verificarConquistas(); // RN018: resistir não muda contagem; conquistas nunca são removidas (RN024)
    rascunho = {};
  },

  // recomecarJornada(jornada) : void — opção dada ao usuário depois de uma recaída (RN019)
  async recomecarJornada(jornada) {
    await jornada.recomecar();
  },

  // obterGatilhoMaisFrequente(jornada) : E-Gatilho | null (RN020: a partir de 3 registros)
  obterGatilhoMaisFrequente(jornada) {
    return jornada.obterGatilhoMaisFrequente(jornada.dataInicio, hoje());
  },
};
