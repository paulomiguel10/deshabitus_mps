// F-TelaOpcoesJornada — UC03 Escolher modo de desabituação (VCP03) e final do UC02 (VCP02)
//   - no cadastro (sem jornada): meta opcional + modo -> registra o hábito e inicia a jornada
//   - com jornada ativa: troca o modo a qualquer momento, sem perder dados (RN010)
// TODO: aplicar o visual do Figma; a lógica fica no C-EscolherModo e no C-CadastrarHabito.
import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import Tela from './components/Tela';
import Campo from './components/Campo';
import Botao from './components/Botao';
import { CadastrarHabito } from '../controller/CadastrarHabito';
import { EscolherModo } from '../controller/EscolherModo';
import { ModoDesabituacao } from '../model/enums';
import { useSessao } from './SessaoContext';
import { cores } from '../theme/cores';

const MODOS = [
  {
    modo: ModoDesabituacao.PADRAO,
    titulo: 'Desabituação padrão',
    texto: 'Mostra os dias, a economia e o progresso normalmente.',
  },
  {
    modo: ModoDesabituacao.CEGO,
    titulo: 'Desabituação cega',
    texto: 'Esconde contadores e números para reduzir a ansiedade. Seus dados continuam sendo registrados.', // RN09
  },
];

function CartaoModo({ item, selecionado, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selecionado }}
      onPress={onPress}
      style={{
        borderWidth: selecionado ? 2 : 1,
        borderColor: selecionado ? cores.primaria : cores.borda,
        backgroundColor: cores.branco,
        borderRadius: 14,
        padding: 16,
        gap: 6,
      }}
    >
      <Text style={{ fontSize: 17, fontWeight: '700', color: cores.primaria }}>{item.titulo}</Text>
      <Text style={{ color: cores.texto }}>{item.texto}</Text>
    </Pressable>
  );
}

export default function TelaOpcoesJornada({ navigation }) {
  const { usuario, jornada, recarregarJornada } = useSessao();
  const [modo, setModo] = useState(() => EscolherModo.iniciarEscolhaModo(jornada));
  const [meta, setMeta] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const cadastrando = !jornada;

  const confirmar = async () => {
    setOcupado(true);
    try {
      if (cadastrando) {
        CadastrarHabito.definirMeta(meta);
        await EscolherModo.escolherModo(modo);        // «include» UC03
        await CadastrarHabito.registrarHabito(usuario);
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
    <Tela titulo={cadastrando ? 'Como você quer acompanhar?' : 'Modo de desabituação'}>
      {cadastrando ? (
        <Campo rotulo="Meta pessoal em dias (opcional)" value={meta} onChangeText={setMeta} keyboardType="number-pad" placeholder="Ex.: 60" />
      ) : null}
      {MODOS.map((item) => (
        <CartaoModo key={item.modo} item={item} selecionado={modo === item.modo} onPress={() => setModo(item.modo)} />
      ))}
      <Botao
        titulo={ocupado ? 'Salvando...' : cadastrando ? 'Começar jornada' : 'Salvar'}
        variante="destaque"
        onPress={confirmar}
        desabilitado={ocupado}
      />
    </Tela>
  );
}
