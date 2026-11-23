// F-TelaJornada — tela inicial: progresso, botão SOS (≤ 2 toques, RNF02) e encerrar jornada (UC12)
// TODO: montar conforme o Figma. Por enquanto só lista as telas para testar a navegação.
import { Text } from 'react-native';
import Tela from './components/Tela';
import Botao from './components/Botao';

const TELAS = [
  ['TelaSOS', 'SOS'],
  ['TelaRegistroGatilhos', 'Registrar gatilho'],
  ['TelaPercepcaoEsforco', 'Check-in de esforço'],
];

export default function TelaJornada({ navigation }) {
  return (
    <Tela titulo="Deshabitus">
      <Text>F-TelaJornada (base). Toque para abrir cada tela:</Text>
      {TELAS.map(([rota, titulo]) => (
        <Botao key={rota} titulo={titulo} variante="contorno" onPress={() => navigation.navigate(rota)} />
      ))}
    </Tela>
  );
}
