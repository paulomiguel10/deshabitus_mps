// F-TelaEscolhaHabito — UC02 Cadastrar hábito e metas (VCP02), passos 1 a 3 do fluxo:
// escolher o hábito (pré-definido ou próprio) e informar consumo, custo, tempo médio e data de início.
// TODO: aplicar o visual do Figma; a lógica fica no C-CadastrarHabito.
import { useState } from 'react';
import { Alert, Platform, Pressable, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Tela from './components/Tela';
import Campo from './components/Campo';
import Botao from './components/Botao';
import Opcoes from './components/Opcoes';
import { CadastrarHabito } from '../controller/CadastrarHabito';
import { useSessao } from './SessaoContext';
import { formatarData, hoje } from '../utils/datas';
import { cores } from '../theme/cores';

const ADICIONE_O_SEU = 'Adicione o seu';

export default function TelaEscolhaHabito({ navigation }) {
  const { usuario } = useSessao();
  const [opcoes] = useState(() => [...CadastrarHabito.iniciarCadastroHabito(), ADICIONE_O_SEU]);
  const [escolha, setEscolha] = useState(null);
  const [proprio, setProprio] = useState('');
  const [consumo, setConsumo] = useState('');
  const [custo, setCusto] = useState('');
  const [tempo, setTempo] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const continuar = () => {
    try {
      CadastrarHabito.informarHabito(escolha === ADICIONE_O_SEU ? proprio : escolha);
      CadastrarHabito.informarDadosConsumo(consumo, custo, tempo, hoje(data));
      navigation.navigate('TelaOpcoesJornada');
    } catch (erro) {
      Alert.alert('Cadastro do hábito', erro.message);
    }
  };

  return (
    <Tela titulo={`Olá, ${usuario?.nome?.split(' ')[0] || 'tudo bem'}! Qual hábito você quer deixar?`}>
      <Opcoes opcoes={opcoes} valor={escolha} onChange={setEscolha} />
      {escolha === ADICIONE_O_SEU ? <Campo rotulo="Qual é o seu hábito?" value={proprio} onChangeText={setProprio} /> : null}

      <Campo rotulo="Quantas vezes por dia?" value={consumo} onChangeText={setConsumo} keyboardType="number-pad" />
      <Campo rotulo="Custo de cada vez (R$)" value={custo} onChangeText={setCusto} keyboardType="decimal-pad" placeholder="Use 0 se não houver custo" />
      <Campo rotulo="Tempo médio de cada vez (minutos)" value={tempo} onChangeText={setTempo} keyboardType="number-pad" />

      <Text style={{ color: cores.texto, fontWeight: '600' }}>Data de início</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Data de início: ${formatarData(hoje(data))}. Toque para alterar`}
        onPress={() => setMostrarCalendario(true)}
        style={{ minHeight: 48, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: cores.branco }}
      >
        <Text style={{ fontSize: 16, color: cores.texto }}>{formatarData(hoje(data))}</Text>
      </Pressable>
      {mostrarCalendario ? (
        <DateTimePicker
          value={data}
          mode="date"
          maximumDate={new Date()} // RN07: não pode ser futura
          onChange={(_evento, escolhida) => {
            setMostrarCalendario(Platform.OS === 'ios');
            if (escolhida) setData(escolhida);
          }}
        />
      ) : null}

      <Botao titulo="Continuar" variante="destaque" onPress={continuar} />
      <Botao titulo="Conta e perfil" variante="contorno" onPress={() => navigation.navigate('TelaConta')} />
    </Tela>
  );
}
