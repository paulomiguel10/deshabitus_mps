import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../../theme/cores';

// Alvo de toque >= 44 px (RNF09)
export default function Botao({ titulo, onPress, variante = 'primario', desabilitado }) {
  const estilo = { primario: styles.primario, destaque: styles.destaque, contorno: styles.contorno, perigo: styles.perigo }[variante];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [styles.base, estilo, (pressed || desabilitado) && { opacity: 0.6 }]}
    >
      <Text style={[styles.texto, variante === 'contorno' && { color: cores.primaria }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  primario: { backgroundColor: cores.primaria },
  destaque: { backgroundColor: cores.destaque },
  perigo: { backgroundColor: cores.perigo },
  contorno: { borderWidth: 1.5, borderColor: cores.primaria },
  texto: { color: cores.branco, fontSize: 16, fontWeight: '600' },
});
