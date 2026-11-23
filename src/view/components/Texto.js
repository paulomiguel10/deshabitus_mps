// Tipografia do design system (Nunito Sans). Toda tela usa <Texto> em vez de <Text>,
// porque a fonte precisa ser informada em cada texto (o React Native não herda fonte).
import { Text } from 'react-native';
import { cores, fontes } from '../../theme/cores';

const VARIANTES = {
  h1: { fontFamily: fontes.extra, fontSize: 28, lineHeight: 34, color: cores.texto },
  h2: { fontFamily: fontes.extra, fontSize: 22, lineHeight: 28, color: cores.texto },
  h3: { fontFamily: fontes.negrito, fontSize: 18, lineHeight: 24, color: cores.texto },
  corpo: { fontFamily: fontes.regular, fontSize: 16, lineHeight: 22, color: cores.texto },
  corpoForte: { fontFamily: fontes.negrito, fontSize: 16, lineHeight: 22, color: cores.texto },
  rotulo: { fontFamily: fontes.negrito, fontSize: 14, lineHeight: 20, color: cores.texto },
  legenda: { fontFamily: fontes.regular, fontSize: 13, lineHeight: 18, color: cores.textoSuave },
  sobretitulo: { fontFamily: fontes.extra, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase', color: cores.textoSuave },
  numero: { fontFamily: fontes.extra, fontSize: 34, lineHeight: 42, color: cores.texto },
  botao: { fontFamily: fontes.negrito, fontSize: 17, lineHeight: 22, color: cores.texto },
};

export default function Texto({ variante = 'corpo', cor, alinhar, style, children, ...props }) {
  return (
    <Text style={[VARIANTES[variante], cor && { color: cor }, alinhar && { textAlign: alinhar }, style]} {...props}>
      {children}
    </Text>
  );
}
