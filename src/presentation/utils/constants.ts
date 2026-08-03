export const ESTADOS_PEDIDO = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;

export const COLORS = {
  primary: '#d32f2f',       
  primaryDark: '#9a0007',   
  accent: '#f57c00',        
  background: '#f4f6f8',    
  card: '#ffffff',          
  textMain: '#222222',     
  textMuted: '#666666',     
  border: '#dddddd',        
  error: '#c62828',        
  success: '#2e7d32',      
};

export type EstadoPedidoType = keyof typeof ESTADOS_PEDIDO;

export const API_BASE_URL = 'https://6a6ffcdb55c0ce38c325cb2b.mockapi.io/api/v1';