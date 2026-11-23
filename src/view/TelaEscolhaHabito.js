// F-TelaEscolhaHabito — UC02: escolha do hábito e dados de consumo
// TODO (UC02): implementar conforme o Figma e o VCP02.
import { Text } from 'react-native';
import Tela from './components/Tela';
import Botao from './components/Botao';
import { useSessao } from './SessaoContext';

export default function TelaEscolhaHabito({ navigation }) {
  const { usuario } = useSessao();
  return (
    <Tela titulo={`Olá, ${usuario?.nome || 'tudo bem'}?`}>
      <Text>F-TelaEscolhaHabito (UC02) – a implementar.</Text>
      <Botao titulo="Conta e perfil" variante="contorno" onPress={() => navigation.navigate('TelaConta')} />
    </Tela>
  );
}
