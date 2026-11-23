// Rotas: abas principais + telas que abrem por cima.
// Os nomes das rotas são os nomes das classes de fronteira (F-) do Astah.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, fontes, gradientes } from '../theme/cores';
import { useSessao } from '../view/SessaoContext';
import Fundo from '../view/components/Fundo';
import Texto from '../view/components/Texto';

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
  TelaJornada: 'home',
  TelaEconomia: 'wallet',
  TelaConquistas: 'trophy',
  TelaDesafios: 'flag',
  TelaConfiguracoes: 'settings',
};

// Ícone da aba: a aba ativa ganha uma "pílula" de gel lima (design system, barra de abas)
function IconeAba({ nome, focado, cor }) {
  if (!focado) return <Ionicons name={`${nome}-outline`} size={22} color={cor} />;
  return (
    <View style={styles.pilula}>
      <LinearGradient colors={gradientes.lima} style={StyleSheet.absoluteFill} />
      <View style={styles.brilhoPilula} />
      <Ionicons name={nome} size={20} color={cores.texto} />
    </View>
  );
}

function Abas() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: cores.ceuClaro },
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarStyle: {
          height: 68 + insets.bottom,
          paddingTop: 8,
          backgroundColor: cores.vidro,
          borderTopColor: cores.bordaSuave,
        },
        tabBarIconStyle: { width: 56, height: 32 },
        tabBarLabelStyle: { fontFamily: fontes.negrito, fontSize: 12 },
        tabBarIcon: ({ focused, color }) => <IconeAba nome={ICONES[route.name]} focado={focused} cor={color} />,
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

// Indicador "PASSO X DE 2" no cabeçalho do cadastro do hábito (UC02)
const Passo1 = () => <Texto variante="sobretitulo">Passo 1 de 2</Texto>;
const Passo2 = () => <Texto variante="sobretitulo">Passo 2 de 2</Texto>;

export default function AppNavigator() {
  const { carregando, usuario, jornada } = useSessao();

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <Fundo />
        <ActivityIndicator size="large" color={cores.texto} />
      </View>
    );
  }

  // Navegação condicional (Fase 1.3):
  //   sem usuário            -> F-TelaConta (UC01)
  //   usuário sem jornada    -> F-TelaEscolhaHabito / F-TelaOpcoesJornada (UC02 / UC03)
  //   usuário com jornada    -> abas + telas por cima
  return (
    <Stack.Navigator
      screenOptions={{
        // Cabeçalho "invisível": mesma cor do topo do fundo, sem título (o título fica na tela)
        title: '',
        headerTintColor: cores.texto,
        headerBackTitle: 'Voltar',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: cores.ceuClaro },
        contentStyle: { backgroundColor: cores.ceuClaro },
      }}
    >
      {/* navigationKey: telas com o mesmo nome em grupos diferentes são recriadas quando o grupo muda.
          Sem isso, ao criar a jornada o app ficava preso na TelaOpcoesJornada (erro GO_BACK). */}
      {!usuario ? (
        <Stack.Screen name="TelaConta" component={TelaConta} options={{ headerShown: false }} navigationKey="sem-usuario" />
      ) : !jornada ? (
        <Stack.Group navigationKey="sem-jornada">
          <Stack.Screen name="TelaEscolhaHabito" component={TelaEscolhaHabito} options={{ headerRight: Passo1 }} />
          <Stack.Screen name="TelaOpcoesJornada" component={TelaOpcoesJornada} options={{ headerRight: Passo2 }} />
          <Stack.Screen name="TelaConta" component={TelaConta} />
        </Stack.Group>
      ) : (
        <Stack.Group navigationKey="com-jornada">
          <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
          <Stack.Screen name="TelaSOS" component={TelaSOS} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="TelaRegistroGatilhos" component={TelaRegistroGatilhos} />
          <Stack.Screen name="TelaPercepcaoEsforco" component={TelaPercepcaoEsforco} />
          <Stack.Screen name="TelaOpcoesJornada" component={TelaOpcoesJornada} />
          <Stack.Screen name="TelaConta" component={TelaConta} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pilula: { width: 56, height: 32, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  brilhoPilula: { position: 'absolute', top: 1, left: 6, right: 6, height: '45%', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.5)' },
});
