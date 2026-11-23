// E-Jornada (DC-ENTIDADE)
// {RN05: no máximo 1 jornada ativa por usuário} {RN07: dataInicio <= hoje}
// {RN019: recomecar() faz dataUltimoReinicio := hoje; dias consecutivos e marcos contam a partir dela}
// {RN022: marcos (5, 10, 20, 40, 60) são calculados pelos dias consecutivos, não armazenados}
// {RN013/RN014: economia e tempo usam os dias evitados desde dataInicio (dias sem recaída), não os consecutivos}
// Associações: E-Usuario possui (1 ◆ 0..*) · acompanha (1 ◆ 1) E-Habito
//              registra (1 ◆ 0..*) E-RegistroTentacao · registra (1 ◆ 0..*) E-CheckInEsforco
//              conquista (1 ◆ 0..*) E-Conquista
import { ModoDesabituacao, Resultado, TipoConquista } from './enums';
import { Habito } from './Habito';
import { Gatilho } from './Gatilho';
import { CheckInEsforco } from './CheckInEsforco';
import { Conquista } from './Conquista';
import { MARCOS_DIAS, MEDALHAS, INTERVALO_MANUTENCAO, NIVEL_ESFORCO } from './regras';
import { pendente } from '../utils/pendente';
import { buscarTodos, buscarUm, executar, paraBoolean } from '../database/banco';
import { ErroNegocio } from '../utils/erros';
import { novoId } from '../utils/ids';
import { agora, diasEntre, hoje, paraDate } from '../utils/datas';

const ULTIMA_MEDALHA = MEDALHAS[MEDALHAS.length - 1].diasNecessarios;

// AAAAMMDD de um instante em milissegundos (dia local)
const diaDe = (ms) => hoje(new Date(ms));

export class Jornada {
  constructor({ id, usuarioId, dataInicio, dataUltimoReinicio = null, metaDias = null,
    modo = ModoDesabituacao.PADRAO, ativa = true } = {}) {
    this.id = id;
    this.usuarioId = usuarioId;                   // composição: a jornada pertence ao usuário
    this.dataInicio = dataInicio;                 // int AAAAMMDD
    this.dataUltimoReinicio = dataUltimoReinicio; // int AAAAMMDD
    this.metaDias = metaDias;                     // int[0..1]
    this.modo = modo;                             // ModoDesabituacao
    this.ativa = ativa;                           // boolean
  }

  // E-Habito da jornada (composição "acompanha"), lido do banco quando preciso
  async #habito() {
    const linha = await buscarUm('SELECT * FROM habito WHERE jornadaId = ?', this.id);
    return linha ? new Habito(linha) : null;
  }

  // + alternarModo(modo : ModoDesabituacao) : void  (RN010: não apaga nem altera outros dados)
  async alternarModo(modo) {
    if (!Object.values(ModoDesabituacao).includes(modo)) throw new ErroNegocio('Modo de desabituação inválido.');
    await executar('UPDATE jornada SET modo = ? WHERE id = ?', modo, this.id);
    this.modo = modo;
  }

  // + calcularDiasConsecutivos() : int  (RN019: conta a partir do último reinício)
  calcularDiasConsecutivos() {
    return Math.max(0, diasEntre(this.dataUltimoReinicio ?? this.dataInicio, hoje()));
  }

  // + obterModo() : ModoDesabituacao
  obterModo() { return this.modo; }

  // + possuiDadosHabitoCompletos() : boolean
  async possuiDadosHabitoCompletos() {
    const habito = await this.#habito();
    return Boolean(habito?.possuiDadosCompletos());
  }

  // + calcularDiasEvitados(inicio : int, fim : int) : int
  // Dias do período menos os dias em que houve recaída (RN013/RN014)
  async calcularDiasEvitados(inicio, fim) {
    const total = Math.max(0, diasEntre(inicio, fim));
    const recaidas = await buscarTodos(
      'SELECT dataHora FROM registroTentacao WHERE jornadaId = ? AND resultado = ?', this.id, Resultado.RECAIU
    );
    const diasComRecaida = new Set(recaidas.map((r) => diaDe(r.dataHora)).filter((d) => d >= inicio && d < fim));
    return Math.max(0, total - diasComRecaida.size);
  }

  // + calcularEconomia(inicio : int, fim : int) : double  (RN013)
  async calcularEconomia(inicio, fim) {
    const habito = await this.#habito();
    return habito ? habito.calcularEconomia(await this.calcularDiasEvitados(inicio, fim)) : 0;
  }

  // + calcularTempoPoupado(inicio : int, fim : int) : int  (RN014)
  async calcularTempoPoupado(inicio, fim) {
    const habito = await this.#habito();
    return habito ? habito.calcularTempoPoupado(await this.calcularDiasEvitados(inicio, fim)) : 0;
  }

  // + registrarTentacao(dataHora : int, resultado : Resultado, gatilho : E-Gatilho, motivoLivre : char, observacao : char) : void
  // {RN015: dataHora <= agora} {RN016: gatilho ou motivo livre, ambos opcionais} {RN029: sincronizado = false}
  async registrarTentacao(dataHora, resultado, gatilho, motivoLivre, observacao) {
    if (!dataHora || dataHora > agora()) throw new ErroNegocio('A data e hora do registro não podem ser no futuro.');
    if (!Object.values(Resultado).includes(resultado)) throw new ErroNegocio('Informe se você resistiu ou recaiu.');
    await executar(
      `INSERT INTO registroTentacao (id, jornadaId, gatilhoId, dataHora, resultado, motivoLivre, observacao, sincronizado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      novoId(), this.id, gatilho?.id ?? null, dataHora, resultado, motivoLivre?.trim() || null, observacao?.trim() || null
    );
  }

  // + obterGatilhoMaisFrequente(inicio : int, fim : int) : E-Gatilho
  // {RN020: só destaca a partir de 3 registros no período} {RN017: motivo livre conta como "Outro"}
  async obterGatilhoMaisFrequente(inicio, fim) {
    const linhas = await buscarTodos(
      `SELECT r.dataHora, r.gatilhoId, g.descricao FROM registroTentacao r
       LEFT JOIN gatilho g ON g.id = r.gatilhoId
       WHERE r.jornadaId = ? AND (r.gatilhoId IS NOT NULL OR r.motivoLivre IS NOT NULL)`,
      this.id
    );
    const doPeriodo = linhas.filter((l) => diaDe(l.dataHora) >= inicio && diaDe(l.dataHora) <= fim);
    if (doPeriodo.length < 3) return null;
    const contagem = new Map();
    for (const l of doPeriodo) {
      const chave = l.gatilhoId ?? 'outro';
      const atual = contagem.get(chave) ?? { id: l.gatilhoId, descricao: l.descricao ?? 'Outro', total: 0 };
      atual.total += 1;
      contagem.set(chave, atual);
    }
    const maior = [...contagem.values()].sort((a, b) => b.total - a.total)[0];
    return new Gatilho({ id: maior.id, descricao: maior.descricao });
  }

  // + sincronizarPendentes() : void  (RN029) — Fase 5
  sincronizarPendentes() { return pendente('Jornada.sincronizarPendentes'); }

  // + recomecar() : void  (RN019: contagem e marcos voltam ao início; histórico e medalhas ficam – RN024)
  async recomecar() {
    const dia = hoje();
    await executar('UPDATE jornada SET dataUltimoReinicio = ? WHERE id = ?', dia, this.id);
    this.dataUltimoReinicio = dia;
  }

  // + verificarConquistas() : void  (RN022, RN023, RN024: cada uma concedida uma única vez)
  async verificarConquistas() {
    const dias = this.calcularDiasConsecutivos();
    const conceder = (tipo, nome, diasNecessarios) =>
      executar(
        'INSERT OR IGNORE INTO conquista (id, jornadaId, tipo, nome, diasNecessarios) VALUES (?, ?, ?, ?, ?)',
        novoId(), this.id, tipo, nome, diasNecessarios
      );
    for (const medalha of MEDALHAS) {
      if (dias >= medalha.diasNecessarios) await conceder(TipoConquista.MEDALHA, medalha.nome, medalha.diasNecessarios);
    }
    for (let d = ULTIMA_MEDALHA + INTERVALO_MANUTENCAO; d <= dias; d += INTERVALO_MANUTENCAO) {
      await conceder(TipoConquista.MANUTENCAO, `Manutenção de ${d} dias`, d);
    }
  }

  // + obterNomeHabito() : char
  async obterNomeHabito() {
    return (await this.#habito())?.obterNome() ?? '';
  }

  // + possuiCheckInHoje() : boolean  (RN021)
  async possuiCheckInHoje() {
    return (await buscarUm('SELECT 1 FROM checkInEsforco WHERE jornadaId = ? AND data = ?', this.id, hoje())) !== null;
  }

  // + registrarCheckIn(nivel : int, observacao : char) : void  (RN021, RN029)
  async registrarCheckIn(nivel, observacao) {
    if (!Number.isInteger(nivel) || nivel < NIVEL_ESFORCO.MIN || nivel > NIVEL_ESFORCO.MAX) {
      throw new ErroNegocio('Escolha um nível de esforço de 1 a 5.');
    }
    if (await this.possuiCheckInHoje()) throw new ErroNegocio('O check-in de hoje já foi feito.');
    await executar(
      'INSERT INTO checkInEsforco (id, jornadaId, data, nivel, observacao, sincronizado) VALUES (?, ?, ?, ?, ?, 0)',
      novoId(), this.id, hoje(), nivel, observacao?.trim() || null
    );
  }

  // + obterCheckInsSemana() : E-CheckInEsforco  (últimos 7 dias, incluindo hoje)
  async obterCheckInsSemana() {
    const seteDiasAtras = new Date(paraDate(hoje()).getTime() - 6 * 86400000);
    const linhas = await buscarTodos(
      'SELECT * FROM checkInEsforco WHERE jornadaId = ? AND data >= ? ORDER BY data', this.id, hoje(seteDiasAtras)
    );
    return linhas.map((l) => new CheckInEsforco({ ...l, sincronizado: paraBoolean(l.sincronizado) }));
  }

  // + obterConquistas() : E-Conquista
  async obterConquistas() {
    const linhas = await buscarTodos('SELECT * FROM conquista WHERE jornadaId = ? ORDER BY diasNecessarios', this.id);
    return linhas.map((l) => new Conquista(l));
  }

  // + obterMarcosAtingidos() : int — o maior marco já atingido na contagem atual (0 se nenhum)
  obterMarcosAtingidos() {
    const dias = this.calcularDiasConsecutivos();
    return MARCOS_DIAS.filter((m) => dias >= m).at(-1) ?? 0;
  }

  // + obterProximoMarco() : int — próximo marco, medalha ou conquista de manutenção
  obterProximoMarco() {
    const dias = this.calcularDiasConsecutivos();
    const proximo = [...MARCOS_DIAS, ...MEDALHAS.map((m) => m.diasNecessarios)].find((m) => m > dias);
    if (proximo) return proximo;
    const passos = Math.floor((dias - ULTIMA_MEDALHA) / INTERVALO_MANUTENCAO) + 1;
    return ULTIMA_MEDALHA + passos * INTERVALO_MANUTENCAO;
  }

  // + estaAtiva() : boolean
  estaAtiva() { return this.ativa; }

  // + encerrar() : void  (UC12, RN030: histórico, registros e conquistas são mantidos)
  async encerrar() {
    await executar('UPDATE jornada SET ativa = 0 WHERE id = ?', this.id);
    this.ativa = false;
  }
}
