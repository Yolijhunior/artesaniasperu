import { useState, useEffect, useCallback } from 'react';
import { Pedido } from '../../domain/models/Pedido';
import { 
  getPedidosDB, 
  insertPedidoDB, 
  deletePedidoDB,
  updatePedidoDB 
} from '../../infrastructure/database/sqlite';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const items: any = getPedidosDB();
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
      insertPedidoDB(pedido);
      await cargarDatos();
    } catch (err: any) {
      setError('Error al registrar el pedido.');
      throw err;
    }
  };

  const actualizarPedido = async (id: number, pedido: any) => {
    try {
      updatePedidoDB(id, pedido);
      await cargarDatos();
    } catch (err: any) {
      setError('Error al actualizar el pedido.');
      throw err;
    }
  };

  const eliminarPedido = async (id: number) => {
    try {
      deletePedidoDB(id);
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