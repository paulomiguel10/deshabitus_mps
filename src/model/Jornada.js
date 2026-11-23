// E-Jornada
// {RN05: no máximo 1 jornada ativa por usuário} {RN07: dataInicio <= hoje}
// {RN19: recomecar() faz dataUltimoReinicio := hoje; dias consecutivos e marcos contam a partir dela}
// {RN22: marcos (5, 10, 20, 40, 60) são calculados} {RN13/RN14: economia e tempo usam os dias evitados}
import { ModoDesabituacao } from './enums';
import { pendente } from '../utils/pendente';

export class Jornada {
  constructor({ id, usuarioId, habitoId, dataInicio, dataUltimoReinicio = null, metaDias = null,
    ativa = true, modo = ModoDesabituacao.PADRAO } = {}) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.habitoId = habitoId;
    this.dataInicio = dataInicio;
    this.dataUltimoReinicio = dataUltimoReinicio;
    this.metaDias = metaDias;
    this.ativa = ativa;
    this.modo = modo; // conferir no Astah em qual classe fica o atributo modo
  }

  static criarJornada(nome, consumoDiario, custoUnitario, tempoMedioConsumo, dataInicio, metaDias) {
    return pendente('Jornada.criarJornada');
  }
  calcularDiasConsecutivos() { return pendente('Jornada.calcularDiasConsecutivos'); }
  calcularDiasEvitados(inicio, fim) { return pendente('Jornada.calcularDiasEvitados'); }
  calcularEconomia() { return pendente('Jornada.calcularEconomia'); }
  calcularTempoPoupado() { return pendente('Jornada.calcularTempoPoupado'); }
  possuiDadosHabitoCompletos() { return pendente('Jornada.possuiDadosHabitoCompletos'); }
  sincronizarPendentes() { return pendente('Jornada.sincronizarPendentes'); }
  recomecar() { return pendente('Jornada.recomecar'); }
  verificarConquistas() { return pendente('Jornada.verificarConquistas'); }
  obterNomeHabito() { return pendente('Jornada.obterNomeHabito'); }
  possuiCheckInHoje() { return pendente('Jornada.possuiCheckInHoje'); }
  registrarCheckIn(nivel, observacao) { return pendente('Jornada.registrarCheckIn'); }
  obterMarcosAtingidos() { return pendente('Jornada.obterMarcosAtingidos'); }
  obterProximoMarco() { return pendente('Jornada.obterProximoMarco'); }
  alternarModo() { return pendente('Jornada.alternarModo'); }
  obterModo() { return this.modo; }
  estaAtiva() { return this.ativa; }
  encerrar() { return pendente('Jornada.encerrar'); } // UC12 / RN30
}
