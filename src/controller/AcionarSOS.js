// C-AcionarSOS — UC11 Acionar modo de emergência SOS (VCP09: E-Jornada, C-RegistrarGatilho 0..1)
// 100% offline (RN027): o conteúdo fica embutido no app. Ao final pergunta o resultado
// e encaminha ao registro de tentação (RN028).
import { Resultado } from '../model/enums';
import { ErroNegocio } from '../utils/erros';

// TODO (equipe): revisar as frases de foco e o tempo de espera com o conteúdo do Figma
const FRASES_FOCO = [
  'Essa vontade vai passar. Respire com calma.',
  'Você já chegou até aqui. Mais alguns minutos.',
  'A fissura dura pouco; a sua conquista fica.',
  'Inspire em 4 segundos, segure em 4 e solte em 6.',
];
export const TEMPO_ESPERA_SEGUNDOS = 180;

let sessao = null;

export const AcionarSOS = {
  // acionarSOS() : { frase, tempoEspera }
  acionarSOS() {
    sessao = {
      inicio: Date.now(),
      frase: FRASES_FOCO[Math.floor(Math.random() * FRASES_FOCO.length)],
    };
    return { frase: sessao.frase, tempoEspera: TEMPO_ESPERA_SEGUNDOS };
  },

  // encerrarSOS() : void
  encerrarSOS() {
    sessao = null;
  },

  // confirmarRegistro(resultado) : Resultado — o resultado segue para o C-RegistrarGatilho (RN028)
  confirmarRegistro(resultado) {
    if (!Object.values(Resultado).includes(resultado)) throw new ErroNegocio('Informe se você resistiu ou recaiu.');
    this.encerrarSOS();
    return resultado;
  },
};
