// Ponto de entrada: abre o banco local (SQLite) -> sessão -> navegação
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { iniciarBanco } from './src/database/banco';
import { Gatilho } from './src/model/Gatilho';
import { firebaseConfigurado } from './src/services/firebase';
import { SessaoProvider } from './src/view/SessaoContext';
import AppNavigator from './src/navigation/AppNavigator';
import { cores } from './src/theme/cores';

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await iniciarBanco();
        // Verificação da Fase 1 (aparece no terminal do "npx expo start")
        const gatilhos = await Gatilho.listarGatilhos();
        console.log(`[Fase 1] SQLite OK: ${gatilhos.length} gatilhos | Firebase configurado: ${firebaseConfigurado}`);
        setBancoPronto(true);
      } catch (e) {
        console.error('[Fase 1] Erro ao iniciar o banco:', e);
        setErro(e.message);
      }
    })();
  }, []);

  if (!bancoPronto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: cores.fundo }}>
        {erro ? <Text style={{ color: cores.perigo }}>Erro ao abrir o banco: {erro}</Text> : <ActivityIndicator color={cores.primaria} />}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SessaoProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SessaoProvider>
    </SafeAreaProvider>
  );
}
