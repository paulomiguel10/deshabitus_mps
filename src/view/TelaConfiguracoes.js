// F-TelaConfiguracoes — UC08 Configurar notificações motivacionais (VCP06)
// Pelo VCP06 esta tela se liga só ao C-ConfigurarNotificacoes.
// Os atalhos abaixo só navegam para as telas de outros casos de uso (não acessam entidades).
// TODO (UC08): notificações motivacionais.
import Tela from './components/Tela';
import Texto from './components/Texto';
import Card from './components/Card';
import ItemLista from './components/ItemLista';

export default function TelaConfiguracoes({ navigation }) {
  return (
    <Tela titulo="Ajustes">
      <Card titulo="Notificações motivacionais" icone="notifications-outline">
        <Texto>A implementar (UC08).</Texto>
      </Card>
      <ItemLista
        titulo="Modo de desabituação"
        descricao="Padrão ou cego"
        icone="eye-outline"
        onPress={() => navigation.navigate('TelaOpcoesJornada')}
      />
      <ItemLista
        titulo="Conta e perfil"
        descricao="Nome, e-mail e exclusão da conta"
        icone="person-outline"
        onPress={() => navigation.navigate('TelaConta')}
      />
    </Tela>
  );
}
