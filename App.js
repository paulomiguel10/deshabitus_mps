// Ponto de entrada: carrega a fonte e abre o banco local (SQLite) -> sessão -> navegação
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { iniciarBanco } from './src/database/banco';
import { Gatilho } from './src/model/Gatilho';
import { firebaseConfigurado } from './src/services/firebase';
import { SessaoProvider } from './src/view/SessaoContext';
import AppNavigator from './src/navigation/AppNavigator';
import { cores, gradientes } from './src/theme/cores';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false);
  const [erro, setErro] = useState(null);
  // Design system: Nunito Sans. Se a fonte falhar, o app segue com a fonte do sistema.
  const [fonteCarregada, erroFonte] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });
  const fontePronta = fonteCarregada || !!erroFonte;

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

  if (!bancoPronto || !fontePronta) {
    return (
      <View style={styles.carregando}>
        <LinearGradient colors={gradientes.ceu} style={StyleSheet.absoluteFill} />
        {erro ? <Text style={{ color: cores.sos }}>Erro ao abrir o banco: {erro}</Text> : <ActivityIndicator size="large" color={cores.texto} />}
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

const styles = StyleSheet.create({
  carregando: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
