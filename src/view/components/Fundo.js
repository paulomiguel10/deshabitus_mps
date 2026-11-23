// Fundo das telas: céu em gradiente, bolhas de vidro e uma folha (Frutiger Aero).
// Fica parado atrás do conteúdo e não recebe toques.
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, LinearGradient as GradienteSvg, Stop } from 'react-native-svg';
import { gradientes } from '../../theme/cores';

// Posição e tamanho das bolhas (em % da tela)
const BOLHAS = [
  { x: '88%', y: '9%', r: 46 },
  { x: '74%', y: '17%', r: 16 },
  { x: '8%', y: '30%', r: 26 },
  { x: '94%', y: '52%', r: 22 },
  { x: '14%', y: '78%', r: 38 },
  { x: '30%', y: '88%', r: 12 },
];

export default function Fundo() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={gradientes.ceu} style={StyleSheet.absoluteFill} />
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bolha" cx="35%" cy="30%" r="70%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
            <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.18" />
            <Stop offset="1" stopColor="#86DDD8" stopOpacity="0.45" />
          </RadialGradient>
        </Defs>
        {BOLHAS.map((b) => (
          <Circle key={`${b.x}-${b.y}`} cx={b.x} cy={b.y} r={b.r} fill="url(#bolha)" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={1.2} />
        ))}
      </Svg>
      <View style={styles.folha}>
        <Svg width={170} height={170} viewBox="0 0 100 100">
          <Defs>
            <GradienteSvg id="folha" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#D4EDA7" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#8CC63F" stopOpacity="0.9" />
            </GradienteSvg>
          </Defs>
          <Path d="M92 8 C48 10 14 34 12 88 C58 86 90 56 92 8 Z" fill="url(#folha)" />
          <Path d="M88 12 C64 34 38 60 16 84" stroke="#FFFFFF" strokeOpacity={0.75} strokeWidth={2} fill="none" />
          <Ellipse cx="60" cy="30" rx="16" ry="6" fill="#FFFFFF" fillOpacity={0.35} transform="rotate(-35 60 30)" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  folha: { position: 'absolute', right: -36, bottom: -30, opacity: 0.45 },
});
