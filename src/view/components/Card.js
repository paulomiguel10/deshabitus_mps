import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../../theme/cores';

export default function Card({ titulo, children }) {
  return (
    <View style={styles.card}>
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: cores.branco, borderRadius: 14, padding: 16, gap: 8, borderWidth: 1, borderColor: cores.borda },
  titulo: { fontSize: 13, fontWeight: '700', color: cores.textoSuave, textTransform: 'uppercase' },
});
