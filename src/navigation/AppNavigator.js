// Rotas: abas principais + telas que abrem por cima.
// Os nomes das rotas são os nomes das classes de fronteira (F-) do Astah.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { cores } from '../theme/cores';
import { useSessao } from '../view/SessaoContext';

import TelaJornada from '../view/TelaJornada';
import TelaEconomia from '../view/TelaEconomia';
import TelaConquistas from '../view/TelaConquistas';
import TelaDesafios from '../view/TelaDesafios';
import TelaConfiguracoes from '../view/TelaConfiguracoes';
import TelaConta from '../view/TelaConta';
import TelaEscolhaHabito from '../view/TelaEscolhaHabito';
import TelaOpcoesJornada from '../view/TelaOpcoesJornada';
import TelaSOS from '../view/TelaSOS';
import TelaRegistroGatilhos from '../view/TelaRegistroGatilhos';
import TelaPercepcaoEsforco from '../view/TelaPercepcaoEsforco';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONES = {
  TelaJornada: 'home-outline',
  TelaEconomia: 'cash-outline',
  TelaConquistas: 'trophy-outline',
  TelaDesafios: 'people-outline',
  TelaConfiguracoes: 'settings-outline',
};

function Abas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONES[route.name]} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="TelaJornada" component={TelaJornada} options={{ title: 'Início' }} />
      <Tab.Screen name="TelaEconomia" component={TelaEconomia} options={{ title: 'Economia' }} />
      <Tab.Screen name="TelaConquistas" component={TelaConquistas} options={{ title: 'Conquistas' }} />
      <Tab.Screen name="TelaDesafios" component={TelaDesafios} options={{ title: 'Desafios' }} />
      <Tab.Screen name="TelaConfiguracoes" component={TelaConfiguracoes} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { carregando, usuario, jornada } = useSessao();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator color={cores.primaria} />
      </View>
    );
  }

  // Navegação condicional (Fase 1.3):
  //   sem usuário            -> F-TelaConta (UC01)
  //   usuário sem jornada    -> F-TelaEscolhaHabito / F-TelaOpcoesJornada (UC02 / UC03)
  //   usuário com jornada    -> abas + telas por cima
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: cores.primaria, headerBackTitle: 'Voltar' }}>
      {!usuario ? (
        <Stack.Screen name="TelaConta" component={TelaConta} options={{ headerShown: false }} />
      ) : !jornada ? (
        <>
          <Stack.Screen name="TelaEscolhaHabito" component={TelaEscolhaHabito} options={{ title: 'Seu hábito' }} />
          <Stack.Screen name="TelaOpcoesJornada" component={TelaOpcoesJornada} options={{ title: 'Sua jornada' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
          <Stack.Screen name="TelaSOS" component={TelaSOS} options={{ title: 'SOS', presentation: 'fullScreenModal' }} />
          <Stack.Screen name="TelaRegistroGatilhos" component={TelaRegistroGatilhos} options={{ title: 'Registrar' }} />
          <Stack.Screen name="TelaPercepcaoEsforco" component={TelaPercepcaoEsforco} options={{ title: 'Check-in' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
