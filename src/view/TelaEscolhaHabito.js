// F-TelaEscolhaHabito — UC02 Cadastrar hábito e metas (VCP02), passos 1 a 3 do fluxo:
// escolher o hábito (pré-definido ou próprio) e informar consumo, custo, tempo médio e data de início.
// Visual: tela "Hábito" do Figma (passo 1 de 2). A lógica fica no C-CadastrarHabito.
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Campo, { CampoData } from './components/Campo';
import Botao from './components/Botao';
import Card from './components/Card';
import Link from './components/Link';
import Opcoes from './components/Opcoes';
import { CadastrarHabito } from '../controller/CadastrarHabito';
import { useSessao } from './SessaoContext';
import { formatarData, hoje } from '../utils/datas';

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
    <Tela sobretitulo={`Olá, ${usuario?.nome?.split(' ')[0] || 'tudo bem'}!`} titulo="Qual hábito você quer deixar?">
      <Opcoes opcoes={opcoes} valor={escolha} onChange={setEscolha} colunas={2} />
      {escolha === ADICIONE_O_SEU ? (
        <Campo rotulo="Qual é o seu hábito?" value={proprio} onChangeText={setProprio} placeholder="Escreva o nome do hábito" />
      ) : null}

      <Card titulo="Seu consumo" icone="stats-chart-outline">
        <Campo rotulo="Quantas vezes por dia?" value={consumo} onChangeText={setConsumo} keyboardType="number-pad" placeholder="Ex.: 10" />
        <Campo rotulo="Custo de cada vez (R$)" ajuda="Use 0 se não houver custo." value={custo} onChangeText={setCusto} keyboardType="decimal-pad" placeholder="Ex.: 1,50" />
        <Campo rotulo="Tempo médio de cada vez (minutos)" value={tempo} onChangeText={setTempo} keyboardType="number-pad" placeholder="Ex.: 5" />
        <CampoData
          rotulo="Data de início"
          valor={formatarData(hoje(data))}
          onPress={() => setMostrarCalendario(true)}
          accessibilityLabel={`Data de início: ${formatarData(hoje(data))}. Toque para alterar`}
        />
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
      </Card>

      <Texto variante="legenda" alinhar="center">Sem certo ou errado: uma estimativa já ajuda.</Texto>
      <Botao titulo="Continuar" icone="arrow-forward" onPress={continuar} />
      <Link texto="Conta e perfil" onPress={() => navigation.navigate('TelaConta')} />
    </Tela>
  );
}
