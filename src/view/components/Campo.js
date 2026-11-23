// Campo de texto "de vidro" com rótulo, texto de ajuda e mensagem de erro.
// CampoData: mesmo visual, mas abre o calendário/relógio ao tocar.
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { cores, fontes, raios } from '../../theme/cores';

function Ajuda({ ajuda, erro }) {
  if (erro) return <Texto variante="legenda" cor={cores.sos}>{erro}</Texto>;
  if (ajuda) return <Texto variante="legenda">{ajuda}</Texto>;
  return null;
}

export default function Campo({ rotulo, ajuda, erro, icone, onFocus, onBlur, multiline, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <View style={styles.grupo}>
      {rotulo ? <Texto variante="rotulo">{rotulo}</Texto> : null}
      <View style={[styles.caixa, multiline && styles.multilinha, foco && styles.foco, erro && styles.comErro]}>
        {icone ? <Ionicons name={icone} size={20} color={cores.textoSuave} /> : null}
        <TextInput
          accessibilityLabel={rotulo}
          accessibilityHint={ajuda}
          placeholderTextColor={cores.placeholder}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputMultilinha]}
          onFocus={(e) => { setFoco(true); onFocus?.(e); }}
          onBlur={(e) => { setFoco(false); onBlur?.(e); }}
          {...props}
        />
      </View>
      <Ajuda ajuda={ajuda} erro={erro} />
    </View>
  );
}

export function CampoData({ rotulo, valor, onPress, ajuda, icone = 'calendar-outline', accessibilityLabel }) {
  return (
    <View style={styles.grupo}>
      {rotulo ? <Texto variante="rotulo">{rotulo}</Texto> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${rotulo}: ${valor}. Toque para alterar`}
        onPress={onPress}
        style={({ pressed }) => [styles.caixa, pressed && styles.foco]}
      >
        <Texto style={styles.valorData}>{valor}</Texto>
        <Ionicons name={icone} size={22} color={cores.textoSuave} />
      </Pressable>
      <Ajuda ajuda={ajuda} />
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: 6 },
  caixa: {
    minHeight: 56,
    borderRadius: raios.g,
    borderWidth: 1,
    borderColor: cores.traco,
    backgroundColor: cores.vidro,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  multilinha: { alignItems: 'flex-start', paddingVertical: 12 },
  foco: { borderColor: cores.lima, borderWidth: 2, paddingHorizontal: 15 },
  comErro: { borderColor: cores.sos },
  input: { flex: 1, minHeight: 48, fontFamily: fontes.regular, fontSize: 16, color: cores.texto },
  inputMultilinha: { minHeight: 80, textAlignVertical: 'top' },
  valorData: { flex: 1 },
});
