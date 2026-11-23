// Firebase: autenticação (E-Usuario), backup/sincronização e desafios em grupo (ADR-002, ADR-005).
// O app NÃO depende dele para funcionar no dia a dia (offline-first, ADR-008).
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Sem .env preenchido, o app roda em "modo local" (sem login real nem nuvem).
export const firebaseConfigurado = Boolean(config.apiKey && config.projectId);

let app = null;
let auth = null;
let db = null;

if (firebaseConfigurado) {
  app = getApps().length ? getApps()[0] : initializeApp(config);
  // Mantém a sessão salva no aparelho: depois do 1º login o app abre offline (RNF10)
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  db = getFirestore(app);
}

export { app, auth, db };
