// F-TelaJornada — tela inicial (VCP10: C-EncerrarJornada)
// SOS em 1 toque (RNF02, RN027), atalhos para registro e check-in, e encerrar jornada (UC12, RN030).
// Pelo VCP10 esta tela só se liga ao C-EncerrarJornada; os atalhos apenas navegam.
import { Alert, StyleSheet, View } from 'react-native';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Botao from './components/Botao';
import Card from './components/Card';
import Link from './components/Link';
import { EncerrarJornada } from '../controller/EncerrarJornada';
import { useSessao } from './SessaoContext';
import { cores } from '../theme/cores';

export default function TelaJornada({ navigation }) {
  const { usuario, jornada, recarregarJornada } = useSessao();

  // UC12: confirmação antes de encerrar
  const encerrar = () =>
    Alert.alert(
      'Encerrar jornada',
      'Seu histórico, seus registros e suas conquistas serão mantidos, e você poderá cadastrar um novo hábito.',
      [
        { text: 'Cancelar', style: 'cancel' }, // fluxo alternativo: a jornada continua ativa
        {
          text: 'Encerrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await EncerrarJornada.encerrarJornada(jornada);
              await recarregarJornada(usuario); // sem jornada ativa, o app volta para o cadastro de hábito
            } catch (erro) {
              Alert.alert('Encerrar jornada', erro.message);
            }
          },
        },
      ]
    );

  return (
    <Tela titulo={`Olá, ${usuario?.nome?.split(' ')[0] || 'tudo bem'}!`} subtitulo="Um passo de cada vez.">
      {/* SOS em 1 toque, sempre no topo (RNF02) */}
      <Card variante="destaque">
        <Texto variante="h3">Bateu a vontade?</Texto>
        <Texto cor={cores.textoSuave}>Respiração guiada e alguns minutos de foco, mesmo sem internet.</Texto>
        <Botao titulo="SOS · preciso de apoio" variante="sos" icone="heart" onPress={() => navigation.navigate('TelaSOS')} />
      </Card>

      <Card titulo="Seu próximo passo" icone="footsteps-outline">
        <Botao titulo="Registrar gatilho ou recaída" variante="destaque" icone="create-outline" onPress={() => navigation.navigate('TelaRegistroGatilhos')} />
        <Botao titulo="Check-in de esforço do dia" variante="contorno" icone="happy-outline" onPress={() => navigation.navigate('TelaPercepcaoEsforco')} />
      </Card>

      <View style={styles.rodape}>
        <Link texto="Encerrar jornada" onPress={encerrar} />
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  rodape: { marginTop: 16 },
});
