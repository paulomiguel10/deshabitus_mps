// F-TelaOpcoesJornada — UC03 Escolher modo de desabituação (VCP03) e final do UC02 (VCP02)
//   - no cadastro (sem jornada): meta opcional + modo -> registra o hábito e inicia a jornada
//   - com jornada ativa: troca o modo a qualquer momento, sem perder dados (RN010)
// Visual: tela "Jornada" do Figma (passo 2 de 2). A lógica fica no C-EscolherModo e no C-CadastrarHabito.
import { useState } from 'react';
import { Alert } from 'react-native';
import Tela from './components/Tela';
import Campo from './components/Campo';
import Botao from './components/Botao';
import Card from './components/Card';
import CartaoOpcao from './components/CartaoOpcao';
import { CadastrarHabito } from '../controller/CadastrarHabito';
import { EscolherModo } from '../controller/EscolherModo';
import { ModoDesabituacao } from '../model/enums';
import { useSessao } from './SessaoContext';

const MODOS = [
  {
    modo: ModoDesabituacao.PADRAO,
    titulo: 'Desabituação padrão',
    texto: 'Mostra os dias, a economia e o progresso normalmente.',
    icone: 'eye-outline',
  },
  {
    modo: ModoDesabituacao.CEGO,
    titulo: 'Desabituação cega',
    texto: 'Esconde contadores e números para reduzir a ansiedade. Seus dados continuam sendo registrados.', // RN09
    icone: 'eye-off-outline',
  },
];

export default function TelaOpcoesJornada({ navigation }) {
  const { usuario, jornada, recarregarJornada } = useSessao();
  const [modoAtual] = useState(() => EscolherModo.iniciarEscolhaModo(jornada));
  const [modo, setModo] = useState(modoAtual);
  const [meta, setMeta] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const cadastrando = !jornada;

  const confirmar = async () => {
    setOcupado(true);
    try {
      if (cadastrando) {
        CadastrarHabito.definirMeta(meta);
        await CadastrarHabito.registrarHabito(usuario, modo); // inclui o UC03 (C-EscolherModo)
        await recarregarJornada(usuario);             // a navegação vai para a tela inicial sozinha
      } else {
        await EscolherModo.escolherModo(modo, jornada);
        await recarregarJornada(usuario);
        if (navigation.canGoBack()) navigation.goBack();
      }
    } catch (erro) {
      Alert.alert('Jornada', erro.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Tela
      titulo={cadastrando ? 'Como você quer acompanhar?' : 'Modo de desabituação'}
      subtitulo="Você pode trocar o modo quando quiser, sem perder seus dados." // RN010
    >
      {cadastrando ? (
        <Card titulo="Meta pessoal" icone="flag-outline">
          <Campo
            rotulo="Meta em dias (opcional)"
            ajuda="Pode deixar em branco."
            value={meta}
            onChangeText={setMeta}
            keyboardType="number-pad"
            placeholder="Ex.: 60"
          />
        </Card>
      ) : null}
      {MODOS.map((item) => (
        <CartaoOpcao
          key={item.modo}
          titulo={item.titulo}
          texto={item.texto}
          icone={item.icone}
          tag={!cadastrando && item.modo === modoAtual ? 'Modo atual' : undefined}
          selecionado={modo === item.modo}
          onPress={() => setModo(item.modo)}
        />
      ))}
      <Botao
        titulo={ocupado ? 'Salvando...' : cadastrando ? 'Começar jornada' : 'Salvar'}
        icone={cadastrando && !ocupado ? 'leaf-outline' : undefined}
        onPress={confirmar}
        desabilitado={ocupado}
      />
    </Tela>
  );
}
