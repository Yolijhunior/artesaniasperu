import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDUeDZah2k8Ue2_2k0KZ9Fd2pIgFn25Dbo",
  authDomain: "artesaniasperuapp.firebaseapp.com",
  projectId: "artesaniasperuapp",
  storageBucket: "artesaniasperuapp.firebasestorage.app",
  messagingSenderId: "478937751946",
  appId: "1:478937751946:web:c3df0916fb3af6344de873"
};

// 1. Inicializar la App de forma segura evitando duplicados
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializar Auth manejando la persistencia y evitando el error de doble inicialización
let auth: any;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const dbFirestore = getFirestore(app);