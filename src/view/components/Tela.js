// Moldura de todas as telas: fundo Frutiger Aero + área segura + rolagem + cabeçalho de texto.
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fundo from './Fundo';
import Texto from './Texto';
import { cores, espaco } from '../../theme/cores';

export default function Tela({ sobretitulo, titulo, subtitulo, topo, children }) {
  const temCabecalho = sobretitulo || titulo || subtitulo;
  return (
    <View style={styles.raiz}>
      <Fundo />
      <SafeAreaView style={styles.raiz} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          {topo}
          {temCabecalho ? (
            <View style={styles.cabecalho}>
              {sobretitulo ? <Texto variante="sobretitulo">{sobretitulo}</Texto> : null}
              {titulo ? <Texto variante="h1" accessibilityRole="header">{titulo}</Texto> : null}
              {subtitulo ? <Texto cor={cores.textoSuave}>{subtitulo}</Texto> : null}
            </View>
          ) : null}
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  conteudo: { padding: espaco.xg, paddingBottom: espaco.xxxg + espaco.g, gap: espaco.g },
  cabecalho: { gap: espaco.xs + 2, marginBottom: espaco.xs },
});
