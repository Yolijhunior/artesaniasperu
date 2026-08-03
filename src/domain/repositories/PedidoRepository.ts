import { Pedido } from '../models/Pedido';

export interface PedidoRepository {
  obtenerPedidos(): Promise<Pedido[]>;
  guardarPedido(pedido: Pedido): Promise<void>;
  eliminarPedido(id: number): Promise<void>;
}