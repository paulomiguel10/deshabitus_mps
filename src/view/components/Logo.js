// Marca do Deshabitus: bolha de água com uma folha dentro (desenho próprio) + nome.
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, LinearGradient as GradienteSvg, Stop } from 'react-native-svg';
import Texto from './Texto';

export default function Logo({ tamanho = 72, comNome = true }) {
  return (
    <View style={styles.logo} accessible accessibilityLabel="Deshabitus">
      <Svg width={tamanho} height={tamanho} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="gota" cx="38%" cy="32%" r="72%">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="0.35" stopColor="#BDEBFA" />
            <Stop offset="1" stopColor="#3FA9A2" />
          </RadialGradient>
          <GradienteSvg id="folhaLogo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#D4EDA7" />
            <Stop offset="1" stopColor="#6FA52B" />
          </GradienteSvg>
        </Defs>
        <Circle cx="50" cy="50" r="46" fill="url(#gota)" stroke="#FFFFFF" strokeWidth={2} />
        <Path d="M70 28 C46 30 30 44 30 72 C54 72 70 56 70 28 Z" fill="url(#folhaLogo)" />
        <Path d="M67 31 C54 44 42 57 33 69" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <Ellipse cx="36" cy="24" rx="16" ry="7" fill="#FFFFFF" fillOpacity={0.7} transform="rotate(-25 36 24)" />
      </Svg>
      {comNome ? <Texto variante="h2">Deshabitus</Texto> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: 'center', gap: 8 },
});
