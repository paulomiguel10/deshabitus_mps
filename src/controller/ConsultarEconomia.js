// C-ConsultarEconomia — UC05 Consultar economia e tempo poupado (VCP05: E-Jornada -> E-Habito)
// Exibe economia acumulada, valores do dia e do mês, tempo poupado e gráfico de evolução (fluxo do UC05).
// RN013/RN014: dias evitados desde dataInicio (sem os dias de recaída). Tudo calculado no aparelho.
import { ErroNegocio } from '../utils/erros';
import { hoje, paraDate } from '../utils/datas';

const DIAS_GRAFICO = 7;
const primeiroDiaDoMes = () => Math.floor(hoje() / 100) * 100 + 1;
const diasAtras = (n) => hoje(new Date(paraDate(hoje()).getTime() - n * 86400000));

export const ConsultarEconomia = {
  // consultarEconomia(jornada) : { modo, total, dia, mes, tempoPoupado, evolucao[] }
  async consultarEconomia(jornada) {
    if (!(await jornada.possuiDadosHabitoCompletos())) {
      throw new ErroNegocio('Faltam dados do hábito para calcular a economia. Complete o cadastro do hábito.');
    }
    const fim = hoje();
    const inicio = jornada.dataInicio;
    const ontem = Math.max(inicio, diasAtras(1));
    const inicioMes = Math.max(inicio, primeiroDiaDoMes());

    // Economia acumulada em cada um dos últimos 7 dias (gráfico de evolução)
    const evolucao = [];
    for (let n = DIAS_GRAFICO - 1; n >= 0; n -= 1) {
      const dia = diasAtras(n);
      evolucao.push({ dia, valor: dia < inicio ? 0 : await jornada.calcularEconomia(inicio, dia) });
    }

    return {
      modo: jornada.obterModo(), // a tela usa o modo para esconder os valores (RN09)
      total: await jornada.calcularEconomia(inicio, fim),
      dia: await jornada.calcularEconomia(ontem, fim),
      mes: await jornada.calcularEconomia(inicioMes, fim),
      tempoPoupado: await jornada.calcularTempoPoupado(inicio, fim),
      evolucao,
    };
  },
};
