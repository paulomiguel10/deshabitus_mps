// Barra de progresso em gel lima (só no modo padrão: no modo cego não há números).
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientes } from '../../theme/cores';

export default function BarraProgresso({ fracao, rotulo }) {
  const pct = Math.max(0, Math.min(1, fracao || 0));
  return (
    <View
      style={styles.trilho}
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      {pct > 0 ? (
        <View style={[styles.preenchido, { width: `${pct * 100}%` }]}>
          <LinearGradient colors={gradientes.lima} style={StyleSheet.absoluteFill} />
          <View style={styles.brilho} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: { height: 14, borderRadius: 7, backgroundColor: 'rgba(84,139,134,0.18)', overflow: 'hidden' },
  preenchido: { height: '100%', borderRadius: 7, overflow: 'hidden', minWidth: 14 },
  brilho: { position: 'absolute', top: 1, left: 4, right: 4, height: '45%', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
});
