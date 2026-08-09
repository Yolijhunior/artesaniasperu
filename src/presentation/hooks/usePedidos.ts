import { useState, useEffect, useCallback } from 'react';
import { Pedido } from '../../domain/models/Pedido';
import { 
  getPedidosFirestore, 
  insertPedidoFirestore, 
  updatePedidoFirestore, 
  deletePedidoFirestore 
} from '../../infrastructure/services/pedidoService';
import { auth } from '../../infrastructure/firebase/firebaseConfig';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setPedidos([]);
        return;
      }

      const items = await getPedidosFirestore(uid);
      setPedidos(items);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pedidos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const registrarNuevoPedido = async (pedido: any) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No hay un usuario autenticado.");
      
      await insertPedidoFirestore(pedido, uid);
      await cargarDatos();
    } catch (err: any) {
      setError('Error al registrar el pedido.');
      throw err;
    }
  };

  const actualizarPedido = async (id: string, pedido: any) => {
    try {
      await updatePedidoFirestore(id, pedido);
      await cargarDatos();
    } catch (err: any) {
      setError('Error al actualizar el pedido.');
      throw err;
    }
  };

  const eliminarPedido = async (id: string) => {
    try {
      await deletePedidoFirestore(id);
      await cargarDatos();
    } catch (err: any) {
      setError('Error al eliminar el pedido.');
      throw err;
    }
  };

  return {
    pedidos,
    cargando,
    error,
    recargarPedidos: cargarDatos,
    registrarNuevoPedido,
    actualizarPedido,
    eliminarPedido,
  };
};