// F-TelaConfiguracoes — UC03/UC08: modo de desabituação e notificações
// TODO (UC08): notificações motivacionais. O acesso à conta (UC01) também fica aqui.
import { Text } from 'react-native';
import Tela from './components/Tela';
import Card from './components/Card';
import Botao from './components/Botao';
import { useSessao } from './SessaoContext';
import { ModoDesabituacao } from '../model/enums';

export default function TelaConfiguracoes({ navigation }) {
  const { jornada } = useSessao();
  const modoAtual = jornada?.obterModo() === ModoDesabituacao.CEGO ? 'Desabituação cega' : 'Desabituação padrão';

  return (
    <Tela titulo="Ajustes">
      <Card titulo="Modo de desabituação">
        <Text>{modoAtual}</Text>
        <Botao titulo="Alterar modo" variante="contorno" onPress={() => navigation.navigate('TelaOpcoesJornada')} />
      </Card>
      <Botao titulo="Conta e perfil" variante="contorno" onPress={() => navigation.navigate('TelaConta')} />
    </Tela>
  );
}
