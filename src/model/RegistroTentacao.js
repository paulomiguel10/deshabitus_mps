// E-RegistroTentacao (motivadoPor -> E-Gatilho)
import { pendente } from '../utils/pendente';

export class RegistroTentacao {
  constructor({ id, jornadaId, gatilhoId, dataHora, motivoLivre = null, observacao = null,
    resultado, sincronizado = false } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;
    this.gatilhoId = gatilhoId;
    this.dataHora = dataHora;       // RN15 / RN29
    this.motivoLivre = motivoLivre; // RN17
    this.observacao = observacao;
    this.resultado = resultado;     // Resultado.RESISTIU | Resultado.RECAIU
    this.sincronizado = sincronizado;
  }

  marcarSincronizado() { return pendente('RegistroTentacao.marcarSincronizado'); }
}
