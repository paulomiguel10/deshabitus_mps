// C-EscolherModo — UC03 Escolher modo de desabituação (VCP03)
// Usado de dois jeitos:
//   - incluído pelo C-CadastrarHabito (UC02 «include» UC03): ainda não há jornada, o modo fica guardado aqui
//   - sozinho, pela F-TelaOpcoesJornada: troca o modo da jornada ativa (E-Jornada 0..1)
import { ModoDesabituacao } from '../model/enums';
import { ErroNegocio } from '../utils/erros';

let modoEscolhido = ModoDesabituacao.PADRAO;

export const EscolherModo = {
  // iniciarEscolhaModo(jornada?) : ModoDesabituacao — o modo que a tela deve mostrar marcado
  iniciarEscolhaModo(jornada = null) {
    modoEscolhido = jornada ? jornada.obterModo() : ModoDesabituacao.PADRAO;
    return modoEscolhido;
  },

  // escolherModo(modo, jornada?) : void
  async escolherModo(modo, jornada = null) {
    if (!Object.values(ModoDesabituacao).includes(modo)) throw new ErroNegocio('Escolha o modo padrão ou o modo cego.');
    modoEscolhido = modo;
    if (jornada) await jornada.alternarModo(modo); // RN09 / RN010
  },

  // usado pelo C-CadastrarHabito no «include»
  obterModoEscolhido() {
    return modoEscolhido;
  },
};
