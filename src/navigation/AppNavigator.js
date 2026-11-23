// Rotas: abas principais + telas que abrem por cima.
// Os nomes das rotas são os nomes das classes de fronteira (F-) do Astah.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../theme/cores';

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
  // TODO (UC01): mostrar TelaConta enquanto não houver usuário logado
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: cores.primaria, headerBackTitle: 'Voltar' }}>
      <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
      <Stack.Screen name="TelaConta" component={TelaConta} options={{ title: 'Conta' }} />
      <Stack.Screen name="TelaEscolhaHabito" component={TelaEscolhaHabito} options={{ title: 'Hábito' }} />
      <Stack.Screen name="TelaOpcoesJornada" component={TelaOpcoesJornada} options={{ title: 'Jornada' }} />
      <Stack.Screen name="TelaSOS" component={TelaSOS} options={{ title: 'SOS', presentation: 'fullScreenModal' }} />
      <Stack.Screen name="TelaRegistroGatilhos" component={TelaRegistroGatilhos} options={{ title: 'Registrar' }} />
      <Stack.Screen name="TelaPercepcaoEsforco" component={TelaPercepcaoEsforco} options={{ title: 'Check-in' }} />
    </Stack.Navigator>
  );
}
