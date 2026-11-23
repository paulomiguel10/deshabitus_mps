// Card "de vidro". Variantes: vidro (padrão) · destaque (gradiente água→lima) · info (céu, para avisos).
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { cores, gradientes, raios, sombra } from '../../theme/cores';

export function IconeBolha({ nome, tamanho = 36, cor = cores.texto }) {
  return (
    <View style={[styles.bolha, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
      <LinearGradient colors={gradientes.agua} style={StyleSheet.absoluteFill} />
      <Ionicons name={nome} size={tamanho * 0.55} color={cor} />
    </View>
  );
}

export default function Card({ titulo, icone, variante = 'vidro', style, children }) {
  return (
    <View style={[styles.card, sombra, variante === 'info' && styles.info, style]}>
      {variante === 'destaque' ? (
        <>
          <LinearGradient colors={gradientes.aguaLima} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: raios.card }]} />
          {/* reflexo suave do vidro na parte de cima, sem linha dura */}
          <LinearGradient
            colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
            style={styles.brilho}
          />
        </>
      ) : null}
      {titulo || icone ? (
        <View style={styles.cabecalho}>
          {icone ? <IconeBolha nome={icone} /> : null}
          {titulo ? <Texto variante="sobretitulo" style={{ flex: 1 }}>{titulo}</Texto> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.vidro,
    borderRadius: raios.card,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
  },
  info: { backgroundColor: 'rgba(223,246,255,0.96)', borderColor: cores.agua },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bolha: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  brilho: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%', borderTopLeftRadius: raios.card, borderTopRightRadius: raios.card },
});
