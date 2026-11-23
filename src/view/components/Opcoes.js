// Lista de opções em "chips" (motivos de gatilho, nível de esforço etc.)
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores } from '../../theme/cores';

export default function Opcoes({ opcoes, valor, onChange }) {
  return (
    <View style={styles.linha}>
      {opcoes.map((op) => {
        const ativo = op === valor;
        return (
          <Pressable
            key={String(op)}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            onPress={() => onChange(op)}
            style={[styles.chip, ativo && styles.ativo]}
          >
            <Text style={[styles.texto, ativo && { color: cores.branco }]}>{op}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, minWidth: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, borderColor: cores.primaria, justifyContent: 'center', alignItems: 'center' },
  ativo: { backgroundColor: cores.primaria },
  texto: { color: cores.primaria, fontWeight: '600' },
});
