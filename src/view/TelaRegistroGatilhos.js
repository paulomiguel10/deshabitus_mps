// F-TelaRegistroGatilhos — UC06 Registrar gatilho e recaída (VCP11)
// Em até 3 toques (RNF02): motivo, resultado, salvar. Data e hora automáticas, editáveis, nunca futuras (RN015).
// Gatilho, motivo livre e observação são opcionais (RN016). Recaída pode recomeçar a contagem (RN019).
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Campo, { CampoData } from './components/Campo';
import Card from './components/Card';
import Botao from './components/Botao';
import Opcoes from './components/Opcoes';
import Interruptor from './components/Interruptor';
import { RegistrarGatilho } from '../controller/RegistrarGatilho';
import { Resultado } from '../model/enums';
import { useSessao } from './SessaoContext';

const OUTRO = 'Outro (escrever)';
const RESULTADOS = { Resisti: Resultado.RESISTIU, 'Recaí': Resultado.RECAIU };
const formatarDataHora = (ms) =>
  new Date(ms).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function TelaRegistroGatilhos({ navigation, route }) {
  const { usuario, jornada, recarregarJornada } = useSessao();
  const [gatilhos, setGatilhos] = useState([]);
  const [maisFrequente, setMaisFrequente] = useState(null);
  const [dataHora, setDataHora] = useState(() => Date.now());
  const [seletor, setSeletor] = useState(null); // 'date' | 'time' | null
  const [escolha, setEscolha] = useState(null);
  const [motivoLivre, setMotivoLivre] = useState('');
  const [observacao, setObservacao] = useState('');
  const [resultado, setResultado] = useState(route.params?.resultado ?? null);
  const [recomecar, setRecomecar] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const inicio = await RegistrarGatilho.iniciarRegistro(route.params?.resultado ?? null);
        setGatilhos(inicio.gatilhos);
        setDataHora(inicio.dataHora);
        setMaisFrequente(await RegistrarGatilho.obterGatilhoMaisFrequente(jornada));
      })();
    }, [jornada, route.params?.resultado])
  );

  const aoEscolherData = (_evento, escolhida) => {
    const proximo = seletor === 'date' && Platform.OS === 'android' ? 'time' : null;
    setSeletor(Platform.OS === 'ios' ? seletor : proximo);
    if (!escolhida) return;
    const nova = new Date(dataHora);
    if (seletor === 'date') nova.setFullYear(escolhida.getFullYear(), escolhida.getMonth(), escolhida.getDate());
    else nova.setHours(escolhida.getHours(), escolhida.getMinutes());
    setDataHora(nova.getTime());
  };

  const salvar = async () => {
    setOcupado(true);
    try {
      const gatilho = gatilhos.find((g) => g.descricao === escolha) ?? null;
      RegistrarGatilho.alterarDataHora(dataHora);
      RegistrarGatilho.informarMotivo(gatilho, escolha === OUTRO ? motivoLivre : null, observacao);
      RegistrarGatilho.informarResultado(resultado);
      await RegistrarGatilho.salvarRegistro(jornada);
      if (resultado === Resultado.RECAIU && recomecar) {
        await RegistrarGatilho.recomecarJornada(jornada);
        await recarregarJornada(usuario);
      }
      Alert.alert('Registro salvo', resultado === Resultado.RESISTIU ? 'Muito bem! Cada vez que você resiste conta.' : 'Tudo bem. O importante é continuar.');
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Registro', erro.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Tela titulo="O que aconteceu?" subtitulo="Registrar ajuda a entender seus gatilhos.">
      {maisFrequente ? (
        <Card variante="destaque" titulo="Seu gatilho mais frequente" icone="analytics-outline">
          <Texto variante="h2">{maisFrequente.descricao}</Texto>
        </Card>
      ) : null}

      <Card titulo="Quando foi" icone="time-outline">
        <CampoData
          rotulo="Data e hora"
          icone="time-outline"
          valor={formatarDataHora(dataHora)}
          onPress={() => setSeletor('date')}
          accessibilityLabel={`Data e hora: ${formatarDataHora(dataHora)}. Toque para alterar`}
        />
        {seletor ? (
          <DateTimePicker value={new Date(dataHora)} mode={seletor} maximumDate={new Date()} onChange={aoEscolherData} />
        ) : null}
      </Card>

      <Card titulo="Gatilho (opcional)" icone="flash-outline">
        <Opcoes opcoes={[...gatilhos.map((g) => g.descricao), OUTRO]} valor={escolha} onChange={(v) => setEscolha(v === escolha ? null : v)} colunas={2} />
        {escolha === OUTRO ? <Campo rotulo="Qual foi o motivo?" value={motivoLivre} onChangeText={setMotivoLivre} /> : null}
        <Campo rotulo="Observação (opcional)" value={observacao} onChangeText={setObservacao} multiline />
      </Card>

      <Card titulo="Resultado" icone="checkmark-done-outline">
        <Opcoes
          opcoes={Object.keys(RESULTADOS)}
          valor={Object.keys(RESULTADOS).find((k) => RESULTADOS[k] === resultado) ?? null}
          onChange={(k) => setResultado(RESULTADOS[k])}
          colunas={2}
        />
        {resultado === Resultado.RECAIU ? (
          <Interruptor
            rotulo="Recomeçar a contagem de dias (seu histórico e suas medalhas continuam)."
            valor={recomecar}
            onChange={setRecomecar}
          />
        ) : null}
      </Card>

      <Botao titulo={ocupado ? 'Salvando...' : 'Salvar'} onPress={salvar} desabilitado={ocupado || !resultado} />
    </Tela>
  );
}
