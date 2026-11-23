// C-EncerrarJornada — UC12 Encerrar jornada (VCP10: E-Jornada)
// RN030: histórico, registros e conquistas são mantidos; o cadastro de outro hábito é liberado.
import { ErroNegocio } from '../utils/erros';

export const EncerrarJornada = {
  // encerrarJornada(jornada) : void
  async encerrarJornada(jornada) {
    if (!jornada?.estaAtiva()) throw new ErroNegocio('Não há jornada ativa para encerrar.');
    await jornada.encerrar();
  },
};
