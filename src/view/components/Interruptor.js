// Linha com texto + interruptor (aceite dos termos, recomeçar contagem...). A linha toda é tocável.
import { Pressable, StyleSheet, Switch } from 'react-native';
import Texto from './Texto';
import { cores, raios } from '../../theme/cores';

export default function Interruptor({ rotulo, valor, onChange }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={rotulo}
      accessibilityState={{ checked: !!valor }}
      onPress={() => onChange(!valor)}
      style={[styles.linha, valor && styles.ligado]}
    >
      <Texto style={styles.texto}>{rotulo}</Texto>
      <Switch
        value={!!valor}
        onValueChange={onChange}
        trackColor={{ false: '#C9D6D4', true: cores.lima }}
        thumbColor={cores.branco}
        ios_backgroundColor="#C9D6D4"
        accessible={false}
        importantForAccessibility="no"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    padding: 14,
    borderRadius: raios.g,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.vidro,
  },
  ligado: { borderColor: cores.lima },
  texto: { flex: 1 },
});
