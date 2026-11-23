// F-TelaConta — UC01: Login, cadastro e perfil
// Fase 1: só indica o estado da configuração. Login e cadastro entram no UC01 (Fase 2).
import { Text } from 'react-native';
import Tela from './components/Tela';
import Card from './components/Card';
import { firebaseConfigurado } from '../services/firebase';
import { cores } from '../theme/cores';

export default function TelaConta() {
  return (
    <Tela titulo="Deshabitus">
      <Text>F-TelaConta (UC01)</Text>
      <Card titulo="Status da Fase 1">
        <Text>Banco local: OK</Text>
        <Text style={{ color: firebaseConfigurado ? cores.texto : cores.perigo }}>
          Firebase: {firebaseConfigurado ? 'configurado' : 'NÃO configurado (preencha o .env)'}
        </Text>
      </Card>
      {/* TODO (UC01): formulário de login, cadastro e recuperação de senha */}
    </Tela>
  );
}
