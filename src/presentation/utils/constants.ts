export const ESTADOS_PEDIDO = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;

export const COLORS = {
  primary: '#d32f2f',       // Rojo corporativo oficial de Artesanías del Perú
  primaryDark: '#9a0007',   // Rojo oscuro para contrastes
  accent: '#f57c00',        // Naranja de acento
  background: '#f4f6f8',    // Fondo general limpio
  card: '#ffffff',          // Fondo de tarjetas
  textMain: '#222222',      // Texto principal
  textMuted: '#666666',     // Texto secundario
  border: '#dddddd',        // Bordes de inputs
  error: '#c62828',         // Color de error
  success: '#2e7d32',       // Color de éxito/completado
};

export type EstadoPedidoType = keyof typeof ESTADOS_PEDIDO;

export const API_BASE_URL = 'https://fakestoreapi.com';