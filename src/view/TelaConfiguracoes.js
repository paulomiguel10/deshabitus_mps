// F-TelaConfiguracoes — UC03/UC08: modo de desabituação e notificações
// TODO (UC03 e UC08): implementar. O acesso à conta (UC01) fica aqui.
import { Text } from 'react-native';
import Tela from './components/Tela';
import Botao from './components/Botao';

export default function TelaConfiguracoes({ navigation }) {
  return (
    <Tela titulo="Ajustes">
      <Text>F-TelaConfiguracoes (UC03/UC08)</Text>
      <Botao titulo="Conta e perfil" variante="contorno" onPress={() => navigation.navigate('TelaConta')} />
    </Tela>
  );
}
