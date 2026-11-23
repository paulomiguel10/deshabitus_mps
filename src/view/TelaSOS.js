// F-TelaSOS — UC11 Acionar modo de emergência SOS (VCP09)
// Respiração guiada, frase de foco e cronômetro. Funciona sem internet (RN027).
// Ao final pergunta se o usuário resistiu e leva ao registro de tentação (RN028).
// Visual: bolha de vidro que cresce e diminui no ritmo da respiração (Frutiger Aero).
import { useEffect, useState } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import Tela from './components/Tela';
import Texto from './components/Texto';
import Botao from './components/Botao';
import Card from './components/Card';
import Link from './components/Link';
import { AcionarSOS } from '../controller/AcionarSOS';
import { Resultado } from '../model/enums';
import { cores } from '../theme/cores';

export default function TelaSOS({ navigation }) {
  const [sos] = useState(() => AcionarSOS.acionarSOS());
  const [restante, setRestante] = useState(sos.tempoEspera);
  const [escala] = useState(() => new Animated.Value(1));
  const [fase, setFase] = useState('Inspire');

  // Cronômetro de espera
  useEffect(() => {
    const t = setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Respiração guiada: inspira 4 s, segura 4 s, solta 6 s
  useEffect(() => {
    const ciclo = Animated.loop(
      Animated.sequence([
        Animated.timing(escala, { toValue: 1.5, duration: 4000, useNativeDriver: true }),
        Animated.delay(4000),
        Animated.timing(escala, { toValue: 1, duration: 6000, useNativeDriver: true }),
      ])
    );
    ciclo.start();
    let passo = 0;
    const tempos = [4000, 4000, 6000];
    const nomes = ['Inspire', 'Segure', 'Solte'];
    let timer;
    const avancar = () => {
      setFase(nomes.at(passo % 3));
      timer = setTimeout(() => { passo += 1; avancar(); }, tempos.at(passo % 3));
    };
    avancar();
    return () => {
      ciclo.stop();
      clearTimeout(timer);
    };
  }, [escala]);

  const finalizar = (resultado) => {
    const r = AcionarSOS.confirmarRegistro(resultado);
    navigation.replace('TelaRegistroGatilhos', { resultado: r }); // RN028
  };

  // Fluxo alternativo: saiu antes do fim do cronômetro -> ainda oferece registrar o momento
  const sair = () =>
    Alert.alert('Sair do SOS', 'Quer registrar este momento?', [
      { text: 'Não', style: 'cancel', onPress: () => { AcionarSOS.encerrarSOS(); navigation.goBack(); } },
      { text: 'Registrar', onPress: () => { AcionarSOS.encerrarSOS(); navigation.replace('TelaRegistroGatilhos'); } },
    ]);

  const mm = String(Math.floor(restante / 60)).padStart(2, '0');
  const ss = String(restante % 60).padStart(2, '0');

  const acabou = restante === 0;

  return (
    <Tela topo={<Link texto="Sair" icone="close" alinhar="left" onPress={sair} />} titulo="Respire com calma">
      <View style={styles.centro}>
        <Animated.View style={{ transform: [{ scale: escala }] }}>
          <BolhaRespiracao />
        </Animated.View>
        <Texto variante="h2" accessibilityLiveRegion="polite">{fase}</Texto>
      </View>
      <Card variante="info">
        <Texto variante="h3" alinhar="center">{sos.frase}</Texto>
        <Texto variante="numero" alinhar="center" accessibilityLabel={`Faltam ${mm} minutos e ${ss} segundos`}>{mm}:{ss}</Texto>
        <Texto alinhar="center" cor={cores.textoSuave}>{acabou ? 'Você resistiu à vontade?' : 'Fique aqui até o tempo acabar.'}</Texto>
      </Card>
      <Botao titulo="Resisti" icone="checkmark-circle-outline" onPress={() => finalizar(Resultado.RESISTIU)} />
      <Botao titulo="Recaí" variante="contorno" onPress={() => finalizar(Resultado.RECAIU)} />
    </Tela>
  );
}

// Bolha de vidro da respiração guiada (desenho próprio)
function BolhaRespiracao() {
  return (
    <Svg width={130} height={130} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="respira" cx="38%" cy="32%" r="70%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="0.4" stopColor="#D4EDA7" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#86DDD8" stopOpacity="0.95" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="47" fill="url(#respira)" stroke="#FFFFFF" strokeWidth={2} />
      <Ellipse cx="36" cy="26" rx="16" ry="7" fill="#FFFFFF" fillOpacity={0.75} transform="rotate(-25 36 26)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  // espaço para a bolha crescer até 1,5x sem cobrir o texto
  centro: { alignItems: 'center', gap: 44, paddingTop: 40, paddingBottom: 8 },
});
