// F-TelaJornada — tela inicial: progresso, botão SOS (≤ 2 toques, RNF02) e encerrar jornada (UC12)
// Por enquanto só lista as outras telas para testar a navegação.
import { Text } from 'react-native';
import Tela from './components/Tela';
import Botao from './components/Botao';

const TELAS = [
  ['TelaSOS', 'SOS'],
  ['TelaRegistroGatilhos', 'Registrar gatilho'],
  ['TelaPercepcaoEsforco', 'Check-in de esforço'],
  ['TelaEscolhaHabito', 'Escolher hábito'],
  ['TelaOpcoesJornada', 'Opções de jornada'],
  ['TelaConta', 'Conta'],
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
