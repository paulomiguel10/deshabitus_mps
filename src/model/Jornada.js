// E-Jornada (DC-ENTIDADE)
// {RN05: no máximo 1 jornada ativa por usuário} {RN07: dataInicio <= hoje}
// {RN019: recomecar() faz dataUltimoReinicio := hoje; dias consecutivos e marcos contam a partir dela}
// {RN022: marcos (5, 10, 20, 40, 60) são calculados pelos dias consecutivos, não armazenados}
// {RN013/RN014: economia e tempo usam os dias evitados desde dataInicio (dias sem recaída), não os consecutivos}
// Associações: E-Usuario possui (1 ◆ 0..*) · acompanha (1 ◆ 1) E-Habito
//              registra (1 ◆ 0..*) E-RegistroTentacao · registra (1 ◆ 0..*) E-CheckInEsforco
//              conquista (1 ◆ 0..*) E-Conquista
import { ModoDesabituacao } from './enums';
import { pendente } from '../utils/pendente';

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

  // + alternarModo(modo : ModoDesabituacao) : void  (RN09, RN010)
  alternarModo(modo) { return pendente('Jornada.alternarModo'); }
  // + calcularDiasConsecutivos() : int  (RN019)
  calcularDiasConsecutivos() { return pendente('Jornada.calcularDiasConsecutivos'); }
  // + obterModo() : ModoDesabituacao
  obterModo() { return this.modo; }
  // + possuiDadosHabitoCompletos() : boolean
  possuiDadosHabitoCompletos() { return pendente('Jornada.possuiDadosHabitoCompletos'); }
  // + calcularDiasEvitados(inicio : int, fim : int) : int  (RN013/RN014)
  calcularDiasEvitados(inicio, fim) { return pendente('Jornada.calcularDiasEvitados'); }
  // + calcularEconomia(inicio : int, fim : int) : double
  calcularEconomia(inicio, fim) { return pendente('Jornada.calcularEconomia'); }
  // + calcularTempoPoupado(inicio : int, fim : int) : int
  calcularTempoPoupado(inicio, fim) { return pendente('Jornada.calcularTempoPoupado'); }
  // + registrarTentacao(dataHora : int, resultado : Resultado, gatilho : E-Gatilho, motivoLivre : char, observacao : char) : void
  registrarTentacao(dataHora, resultado, gatilho, motivoLivre, observacao) {
    return pendente('Jornada.registrarTentacao');
  }
  // + obterGatilhoMaisFrequente(inicio : int, fim : int) : E-Gatilho  (RN020)
  obterGatilhoMaisFrequente(inicio, fim) { return pendente('Jornada.obterGatilhoMaisFrequente'); }
  // + sincronizarPendentes() : void  (RN029)
  sincronizarPendentes() { return pendente('Jornada.sincronizarPendentes'); }
  // + recomecar() : void  (RN019)
  recomecar() { return pendente('Jornada.recomecar'); }
  // + verificarConquistas() : void  (RN022, RN023, RN024)
  verificarConquistas() { return pendente('Jornada.verificarConquistas'); }
  // + obterNomeHabito() : char
  obterNomeHabito() { return pendente('Jornada.obterNomeHabito'); }
  // + possuiCheckInHoje() : boolean  (RN021)
  possuiCheckInHoje() { return pendente('Jornada.possuiCheckInHoje'); }
  // + registrarCheckIn(nivel : int, observacao : char) : void  (RN021)
  registrarCheckIn(nivel, observacao) { return pendente('Jornada.registrarCheckIn'); }
  // + obterCheckInsSemana() : E-CheckInEsforco
  obterCheckInsSemana() { return pendente('Jornada.obterCheckInsSemana'); }
  // + obterConquistas() : E-Conquista
  obterConquistas() { return pendente('Jornada.obterConquistas'); }
  // + obterMarcosAtingidos() : int  (RN022)
  obterMarcosAtingidos() { return pendente('Jornada.obterMarcosAtingidos'); }
  // + obterProximoMarco() : int  (RN022)
  obterProximoMarco() { return pendente('Jornada.obterProximoMarco'); }
  // + estaAtiva() : boolean
  estaAtiva() { return this.ativa; }
  // + encerrar() : void  (UC12, RN030)
  encerrar() { return pendente('Jornada.encerrar'); }
}
