import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { dbFirestore } from '../firebase/firebaseConfig';

const COLLECTION_NAME = 'pedidos';

export const getPedidosFirestore = async (uid: string) => {
  try {
    const q = query(collection(dbFirestore, COLLECTION_NAME), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const pedidos: any[] = [];
    querySnapshot.forEach((docSnap) => {
      pedidos.push({ id: docSnap.id, ...docSnap.data() });
    });
    return pedidos;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return [];
  }
};

export const insertPedidoFirestore = async (pedido: any, uid: string) => {
  try {
    await addDoc(collection(dbFirestore, COLLECTION_NAME), {
      ...pedido,
      uid, // Asociamos el pedido al usuario autenticado
      fechaRegistro: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const updatePedidoFirestore = async (id: string, pedido: any) => {
  try {
    const pedidoRef = doc(dbFirestore, COLLECTION_NAME, id);
    await updateDoc(pedidoRef, pedido);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const deletePedidoFirestore = async (id: string) => {
  try {
    await deleteDoc(doc(dbFirestore, COLLECTION_NAME, id));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};