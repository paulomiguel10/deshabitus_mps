import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../../theme/cores';

export default function Tela({ titulo, children }) {
  return (
    <SafeAreaView style={styles.area} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        {titulo ? <Text style={styles.titulo} accessibilityRole="header">{titulo}</Text> : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 14 },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.primaria, marginBottom: 4 },
});
