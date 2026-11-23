// Cartão de escolha única (radio) com ícone, título, descrição e etiqueta opcional.
// Usado na escolha do modo de desabituação (padrão / cego).
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { IconeBolha } from './Card';
import { cores, raios, sombra } from '../../theme/cores';

export default function CartaoOpcao({ titulo, texto, icone, tag, selecionado, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: !!selecionado }}
      accessibilityLabel={`${titulo}. ${texto}`}
      onPress={onPress}
      style={({ pressed }) => [styles.cartao, sombra, selecionado && styles.selecionado, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.topo}>
        {icone ? <IconeBolha nome={icone} tamanho={40} /> : null}
        <View style={{ flex: 1, gap: 4 }}>
          {tag ? (
            <View style={styles.tag}>
              <Texto variante="sobretitulo" cor={cores.texto}>{tag}</Texto>
            </View>
          ) : null}
          <Texto variante="h3">{titulo}</Texto>
        </View>
        <View style={[styles.radio, selecionado && styles.radioMarcado]}>
          {selecionado ? <Ionicons name="checkmark" size={16} color={cores.texto} /> : null}
        </View>
      </View>
      <Texto cor={cores.textoSuave}>{texto}</Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.vidro,
    borderRadius: raios.card,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    padding: 18,
    gap: 10,
  },
  selecionado: { borderColor: cores.lima, borderWidth: 2.5, padding: 16.5 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tag: { alignSelf: 'flex-start', backgroundColor: cores.limaClaro, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: cores.traco, alignItems: 'center', justifyContent: 'center' },
  radioMarcado: { backgroundColor: cores.lima, borderColor: cores.lima },
});
