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

// Mensagens em português para os erros do Firebase Auth
const MENSAGENS = {
  'auth/email-already-in-use': 'Este e-mail já tem uma conta.', // RN01
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/requires-recent-login': 'Por segurança, entre novamente na conta e repita a operação.',
};

export const traduzirErroFirebase = (erro) => MENSAGENS[erro?.code] ?? 'Não foi possível concluir. Tente novamente.';
