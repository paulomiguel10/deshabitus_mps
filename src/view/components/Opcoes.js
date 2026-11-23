// Chips de escolha única (hábitos, gatilhos, resultado, nível de esforço).
// Selecionado = gel lima com ✓. Com "colunas", os chips ficam em grade de largura igual.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Texto from './Texto';
import { cores, gradientes } from '../../theme/cores';

const ESPACO = 10;

export default function Opcoes({ opcoes, valor, onChange, colunas, compacto }) {
  const [largura, setLargura] = useState(0);
  const larguraItem = colunas && largura ? (largura - ESPACO * (colunas - 1)) / colunas : undefined;

  return (
    <View style={styles.linha} onLayout={(e) => setLargura(e.nativeEvent.layout.width)} accessibilityRole="radiogroup">
      {opcoes.map((op) => {
        const ativo = op === valor;
        return (
          <Pressable
            key={String(op)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativo }}
            accessibilityLabel={String(op)}
            onPress={() => onChange(op)}
            style={({ pressed }) => [
              styles.chip,
              larguraItem && { width: larguraItem },
              !ativo && styles.inativo,
              pressed && { opacity: 0.85 },
            ]}
          >
            {ativo ? (
              <>
                <LinearGradient colors={gradientes.lima} style={StyleSheet.absoluteFill} />
                <View style={styles.brilho} />
              </>
            ) : null}
            {ativo && !compacto ? <Ionicons name="checkmark-circle" size={18} color={cores.texto} /> : null}
            <Texto variante={ativo ? 'corpoForte' : 'corpo'} alinhar="center" style={styles.texto}>{op}</Texto>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: ESPACO },
  chip: {
    minHeight: 52,
    minWidth: 48,
    paddingHorizontal: 14,
    borderRadius: 26,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: cores.lima,
  },
  inativo: { backgroundColor: cores.vidro, borderColor: cores.bordaSuave, borderWidth: 1 },
  brilho: { position: 'absolute', top: 2, left: 10, right: 10, height: '45%', borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.45)' },
  texto: { flexShrink: 1 },
});
