import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

interface PedidoCardProps {
  item: any;
  onVer: (item: any) => void;
  onEditar: (item: any) => void;
  onEliminar: (id: number) => void;
}

const getBadgeStyle = (estado: string) => {
  switch (estado) {
    case 'ENTREGADO': return { bg: '#e8f5e9', text: '#2e7d32' };
    case 'EN PROCESO':
    case 'EN_PROCESO': return { bg: '#e3f2fd', text: '#1565c0' };
    case 'CANCELADO': return { bg: '#ffebee', text: '#c62828' };
    default: return { bg: '#fff8e1', text: '#f57c00' };
  }
};

// Función para formatear fecha y hora legible para Perú
const formatearFechaHora = (fechaStr: string) => {
  if (!fechaStr) return '';
  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return fechaStr; 
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // Cambia a false si prefieres formato de 24 horas
  });
};

export const PedidoCard = ({ item, onVer, onEditar, onEliminar }: PedidoCardProps) => {
  const badgeInfo = getBadgeStyle(item.estado);
  const estadoTextoLimpio = item.estado === 'EN_PROCESO' ? 'EN PROCESO' : item.estado;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cliente}>{item.clienteNombre}</Text>
        <Text style={[styles.badge, { backgroundColor: badgeInfo.bg, color: badgeInfo.text }]}>
          {estadoTextoLimpio}
        </Text>
      </View>
      
      <Text style={styles.prodText}>Producto: {item.producto}</Text>
      <Text style={styles.priceText}>Precio Total: S/ {Number(item.precio || 0).toFixed(2)}</Text>
      <Text style={styles.fecha}>Fecha y Hora: {formatearFechaHora(item.fechaRegistro)}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnDetail} onPress={() => onVer(item)}>
          <Ionicons name="eye-outline" size={14} color="#fff" />
          <Text style={styles.btnActionText}>Ver</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnEdit} onPress={() => onEditar(item)}>
          <Ionicons name="create-outline" size={14} color="#fff" />
          <Text style={styles.btnActionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDelete} onPress={() => onEliminar(item.id)}>
          <Ionicons name="trash-outline" size={14} color="#fff" />
          <Text style={styles.btnActionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cliente: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  badge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, overflow: 'hidden' },
  prodText: { fontSize: 14, color: COLORS.textMain, marginBottom: 2 },
  priceText: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 2 },
  fecha: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 6, marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  btnDetail: { backgroundColor: '#0284c7', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 5, gap: 3 },
  btnEdit: { backgroundColor: '#d97706', flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 5, gap: 3 },
  btnDelete: { backgroundColor: COLORS.error, flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 5, gap: 3 },
  btnActionText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});