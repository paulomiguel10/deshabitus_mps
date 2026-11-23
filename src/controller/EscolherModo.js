// C-EscolherModo — UC03 Escolher modo de desabituação (VCP03)
// Usado de dois jeitos:
//   - incluído pelo C-CadastrarHabito (UC02 «include» UC03): ainda não há jornada, só valida o modo
//   - sozinho, pela F-TelaOpcoesJornada: troca o modo da jornada ativa (E-Jornada 0..1)
import { ModoDesabituacao } from '../model/enums';
import { ErroNegocio } from '../utils/erros';

export const EscolherModo = {
  // iniciarEscolhaModo(jornada?) : ModoDesabituacao — o modo que a tela deve mostrar marcado
  iniciarEscolhaModo(jornada = null) {
    return jornada ? jornada.obterModo() : ModoDesabituacao.PADRAO;
  },

  // escolherModo(modo, jornada?) : void
  async escolherModo(modo, jornada = null) {
    if (!Object.values(ModoDesabituacao).includes(modo)) throw new ErroNegocio('Escolha o modo padrão ou o modo cego.');
    if (jornada) await jornada.alternarModo(modo); // RN09 / RN010
  },
};
