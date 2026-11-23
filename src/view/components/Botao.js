// Botão "gel" do design system: 56 px de altura, cantos de 28 px, brilho na metade de cima.
// Variantes: primario (lima) · destaque (água) · contorno (vidro) · sos (coral) · perigo (contorno coral)
// Alvo de toque >= 44 px (RNF09).
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { cores, gradientes, raios, sombra } from '../../theme/cores';

const VARIANTES = {
  primario: { gradiente: gradientes.lima, texto: cores.texto },
  destaque: { gradiente: gradientes.agua, texto: cores.texto },
  sos: { gradiente: gradientes.sos, locais: [0, 0.5], texto: cores.branco, brilho: 0.2 },
  contorno: { fundo: cores.vidro, borda: cores.traco, texto: cores.texto },
  perigo: { fundo: cores.vidro, borda: cores.sos, texto: cores.sos },
};

export default function Botao({ titulo, onPress, variante = 'primario', desabilitado, icone, accessibilityHint }) {
  const v = VARIANTES[variante] ?? VARIANTES.primario;
  const corTexto = desabilitado ? cores.textoDesabilitado : v.texto;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!desabilitado }}
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [styles.sombra, !desabilitado && v.gradiente && sombra, pressed && styles.pressionado]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.corpo,
            v.borda && { borderWidth: 1.5, borderColor: desabilitado ? cores.bordaSuave : v.borda, backgroundColor: v.fundo },
            desabilitado && v.gradiente && { backgroundColor: cores.desabilitado },
          ]}
        >
          {v.gradiente && !desabilitado ? (
            <>
              <LinearGradient colors={v.gradiente} locations={v.locais} style={StyleSheet.absoluteFill} />
              <View style={[styles.brilho, v.brilho && { backgroundColor: `rgba(255,255,255,${v.brilho})`, height: '38%' }]} />
            </>
          ) : null}
          {pressed ? <View style={styles.sombraToque} /> : null}
          {icone ? <Ionicons name={icone} size={20} color={corTexto} /> : null}
          <Texto variante="botao" cor={corTexto}>{titulo}</Texto>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sombra: { borderRadius: raios.pilula },
  corpo: {
    minHeight: 56,
    borderRadius: raios.pilula,
    paddingHorizontal: 22,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  // Reflexo "molhado" do gel na metade de cima
  brilho: {
    position: 'absolute',
    top: 2,
    left: 14,
    right: 14,
    height: '46%',
    borderRadius: raios.pilula,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  sombraToque: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,61,58,0.10)' },
  pressionado: { transform: [{ scale: 0.98 }] },
});
