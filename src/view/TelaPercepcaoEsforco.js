// F-TelaPercepcaoEsforco — UC09 Registrar check-in de esforço (VCP07)
// Nível de 1 a 5 e observação opcional; um check-in por dia (RN021).
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Card from './components/Card';
import Campo from './components/Campo';
import Botao from './components/Botao';
import Opcoes from './components/Opcoes';
import { RegistrarCheckIn } from '../controller/RegistrarCheckIn';
import { useSessao } from './SessaoContext';

export default function TelaPercepcaoEsforco({ navigation }) {
  const { jornada } = useSessao();
  const [nivel, setNivel] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const salvar = async () => {
    setOcupado(true);
    try {
      await RegistrarCheckIn.registrarCheckIn(jornada, nivel, observacao);
      Alert.alert('Check-in', 'Check-in de hoje registrado.');
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Check-in', erro.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <Tela titulo="Como foi o seu dia?" subtitulo="Um check-in por dia, para acompanhar o seu esforço.">
      <Card titulo="Nível de esforço" icone="pulse-outline">
        <Opcoes opcoes={[1, 2, 3, 4, 5]} valor={nivel} onChange={setNivel} colunas={5} compacto />
        <View style={styles.escala}>
          <Texto variante="legenda">1 = foi tranquilo</Texto>
          <Texto variante="legenda">5 = foi muito difícil</Texto>
        </View>
      </Card>
      <Card>
        <Campo rotulo="Observação (opcional)" value={observacao} onChangeText={setObservacao} multiline placeholder="Ex.: senti vontade depois do almoço" />
      </Card>
      <Botao titulo={ocupado ? 'Salvando...' : 'Salvar check-in'} onPress={salvar} desabilitado={ocupado || !nivel} />
    </Tela>
  );
}

const styles = StyleSheet.create({
  escala: { flexDirection: 'row', justifyContent: 'space-between' },
});
