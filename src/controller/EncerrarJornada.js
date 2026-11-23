// C-EncerrarJornada — UC12 – Encerrar jornada
// Controller: recebe as ações da tela (F-) e aplica as regras usando as entidades (E-).
import { pendente } from '../utils/pendente';

export const EncerrarJornada = {
  encerrarJornada() {
    return pendente('EncerrarJornada.encerrarJornada');
  },
};
