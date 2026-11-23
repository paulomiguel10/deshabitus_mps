// Linha de menu "de vidro": ícone, título, descrição e seta (tela de Ajustes).
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { IconeBolha } from './Card';
import { cores, raios, sombra } from '../../theme/cores';

export default function ItemLista({ titulo, descricao, icone, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={descricao ? `${titulo}. ${descricao}` : titulo}
      onPress={onPress}
      style={({ pressed }) => [styles.item, sombra, pressed && { opacity: 0.85 }]}
    >
      {icone ? <IconeBolha nome={icone} tamanho={40} /> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Texto variante="corpoForte">{titulo}</Texto>
        {descricao ? <Texto variante="legenda">{descricao}</Texto> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: raios.card,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.vidro,
  },
});
