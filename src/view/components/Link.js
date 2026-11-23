// Link de texto (Esqueci minha senha, ‹ Voltar...). Alvo de toque >= 44 px (RNF09).
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { cores } from '../../theme/cores';

export default function Link({ texto, onPress, icone, alinhar = 'center' }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={texto}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.link, { alignSelf: alinhar === 'left' ? 'flex-start' : 'center' }, pressed && { opacity: 0.6 }]}
    >
      {icone ? <Ionicons name={icone} size={18} color={cores.texto} /> : null}
      <Texto variante="rotulo" style={!icone && styles.sublinhado}>{texto}</Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  sublinhado: { textDecorationLine: 'underline' },
});
