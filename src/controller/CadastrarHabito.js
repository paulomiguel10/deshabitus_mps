// C-CadastrarHabito — UC02 Cadastrar hábito e metas (VCP02)
// Fluxo do documento: escolher hábito -> consumo, custo, tempo médio e data -> meta (opcional)
// -> «include» UC03 (C-EscolherModo) -> validar, registrar o hábito e iniciar a jornada.
import { EscolherModo } from './EscolherModo';
import { ErroNegocio } from '../utils/erros';
import { hoje } from '../utils/datas';

// Opções pré-definidas (Relatório de Design Sprint, tela de escolha do hábito) + "adicione o seu"
export const OPCOES_HABITO = ['Fumo', 'Bebidas', 'Drogas', 'Jogos', 'Redes sociais'];

let rascunho = {};

const paraNumero = (texto) => {
  if (texto === '' || texto === null || texto === undefined) return NaN;
  return Number(String(texto).replace(',', '.'));
};

export const CadastrarHabito = {
  // iniciarCadastroHabito() : opções de hábito
  iniciarCadastroHabito() {
    rascunho = {};
    EscolherModo.iniciarEscolhaModo(null);
    return OPCOES_HABITO;
  },

  // informarHabito(nome) : void
  informarHabito(nome) {
    if (!nome?.trim()) throw new ErroNegocio('Escolha um hábito ou escreva o seu.');
    rascunho.nome = nome.trim();
  },

  // informarDadosConsumo(consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio) : void
  informarDadosConsumo(consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio) {
    const consumo = paraNumero(consumoDiario);
    const custo = paraNumero(custoUnitario);
    const tempo = paraNumero(tempoMedioConsumo);
    if (!Number.isInteger(consumo) || consumo <= 0) throw new ErroNegocio('Informe quantas vezes por dia (número inteiro maior que zero).'); // RN06
    if (!Number.isFinite(custo) || custo < 0) throw new ErroNegocio('Informe o custo de cada consumo (use 0 se não houver custo).'); // RN06
    if (!Number.isInteger(tempo) || tempo <= 0) throw new ErroNegocio('Informe o tempo médio de cada consumo, em minutos.'); // RN08
    if (!dataInicio) throw new ErroNegocio('Informe a data de início.'); // RN06
    if (dataInicio > hoje()) throw new ErroNegocio('A data de início não pode ser no futuro.'); // RN07
    Object.assign(rascunho, { consumoDiario: consumo, custoUnitario: custo, tempoMedioConsumo: tempo, dataInicio });
  },

  // definirMeta(metaDias) : void — opcional (RN06)
  definirMeta(metaDias) {
    if (metaDias === '' || metaDias === null || metaDias === undefined) {
      rascunho.metaDias = null;
      return;
    }
    const meta = paraNumero(metaDias);
    if (!Number.isInteger(meta) || meta <= 0) throw new ErroNegocio('A meta deve ser um número de dias maior que zero, ou fique em branco.');
    rascunho.metaDias = meta;
  },

  // registrarHabito(usuario) : E-Jornada
  async registrarHabito(usuario) {
    const { nome, consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio, metaDias } = rascunho;
    const modo = EscolherModo.obterModoEscolhido(); // «include» UC03
    const jornada = await usuario.criarJornada(nome, consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio, metaDias, modo);
    rascunho = {};
    return jornada;
  },
};
