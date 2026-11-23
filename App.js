// Ponto de entrada: banco local (SQLite) -> navegação
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { migrarBanco } from './src/database/migracoes';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="deshabitus.db" onInit={migrarBanco}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
