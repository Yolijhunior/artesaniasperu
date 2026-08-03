import { EstadoPedidoType } from '../../presentation/utils/constants';

export interface Pedido {
  id?: number;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  precio: number;
  estado: EstadoPedidoType;
  fechaRegistro: string;
}