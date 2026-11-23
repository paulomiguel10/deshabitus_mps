// E-RegistroTentacao (DC-ENTIDADE) — parte da E-Jornada: registra (Jornada 1 ◆ 0..*)
// {RN015: dataHora <= agora} {RN016: gatilho OU motivoLivre, ambos opcionais}
// {RN029: criado com sincronizado = false}
import { pendente } from '../utils/pendente';

export class RegistroTentacao {
  constructor({ id, jornadaId, gatilhoId = null, dataHora, resultado, motivoLivre = null,
    observacao = null, sincronizado = false } = {}) {
    this.id = id;
    this.jornadaId = jornadaId;     // composição com a jornada
    this.gatilhoId = gatilhoId;     // motivadoPor 0..1
    this.dataHora = dataHora;       // int (ms)
    this.resultado = resultado;     // Resultado
    this.motivoLivre = motivoLivre; // char[0..1]
    this.observacao = observacao;   // char[0..1]
    this.sincronizado = sincronizado; // boolean
  }

  // + marcarSincronizado() : void
  marcarSincronizado() { return pendente('RegistroTentacao.marcarSincronizado'); }
}
