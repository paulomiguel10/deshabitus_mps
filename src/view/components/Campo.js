import { StyleSheet, Text, TextInput, View } from 'react-native';
import { cores } from '../../theme/cores';

export default function Campo({ rotulo, ...props }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput accessibilityLabel={rotulo} placeholderTextColor={cores.textoSuave} style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { color: cores.texto, fontWeight: '600' },
  input: {
    minHeight: 48, borderWidth: 1, borderColor: cores.borda, borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: cores.branco, color: cores.texto, fontSize: 16,
  },
});
