import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export const registrarUsuarioFirebase = async (nombre: string, email: string, pass: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    // Actualizamos el nombre del usuario en su perfil de Firebase
    await updateProfile(userCredential.user, { displayName: nombre });
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al registrar usuario en Firebase.' };
  }
};

export const loginUsuarioFirebase = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: 'Correo o contraseña incorrectos.' };
  }
};

export const logoutUsuarioFirebase = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};