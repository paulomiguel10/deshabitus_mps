// Firebase: autenticação (E-Usuario), backup/sincronização e desafios em grupo (ADR-002, ADR-005).
// O app não depende dele no dia a dia (offline-first, ADR-008), mas o cadastro e o 1º login sim (RNF10).
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

// false = o .env não foi preenchido (ver TUTORIAL.md, seção 4)
export const firebaseConfigurado = Boolean(config.apiKey && config.projectId && config.appId);

let app = null;
let auth = null;
let firestore = null;

if (firebaseConfigurado) {
  app = getApps().length ? getApps()[0] : initializeApp(config);
  // Sessão salva no aparelho: depois do 1º login o app abre mesmo offline (RNF10)
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  firestore = getFirestore(app);
}

export { app, auth, firestore };
