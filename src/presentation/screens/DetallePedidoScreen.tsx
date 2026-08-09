import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { usePedidos } from '../hooks/usePedidos';

export const DetallePedidoScreen = ({ route, navigation }: any) => {
  const { pedido } = route.params || {};
  const { eliminarPedido, recargarPedidos } = usePedidos() as any;

  if (!pedido) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.errorText}>No se encontró información del pedido.</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar Pedido',
      '¿Estás seguro de eliminar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: async () => {
            if (typeof eliminarPedido === 'function') {
              await eliminarPedido(pedido.id);
              if (typeof recargarPedidos === 'function') recargarPedidos();
            }
            navigation.goBack();
          }, 
          style: 'destructive' 
        },
      ]
    );
  };

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'ENTREGADO': return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'EN PROCESO':
      case 'EN_PROCESO': return { bg: '#e3f2fd', text: '#1565c0' };
      case 'CANCELADO': return { bg: '#ffebee', text: '#c62828' };
      default: return { bg: '#fff8e1', text: '#f57c00' };
    }
  };

  const badgeInfo = getBadgeStyle(pedido.estado);
  const estadoLimpio = pedido.estado === 'EN_PROCESO' ? 'EN PROCESO' : pedido.estado;

  // Formatear la fecha de registro correctamente
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return 'No registrada';
    try {
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) return fechaStr;
      return fecha.toLocaleDateString() + ', ' + fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return fechaStr;
    }
  };

  const precioTotalFinal = Number(pedido.precio || 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.labelCode}>ID de Pedido: #{pedido.id || 'N/A'}</Text>
            <Text style={[styles.badge, { backgroundColor: badgeInfo.bg, color: badgeInfo.text }]}>
              {estadoLimpio}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{pedido.clienteNombre || 'Sin cliente'}</Text>

          <Text style={styles.label}>Productos Solicitados</Text>
          <Text style={styles.value}>{pedido.producto || 'Sin producto'}</Text>

          <Text style={styles.label}>Precio Total</Text>
          <Text style={styles.totalValue}>S/ {precioTotalFinal.toFixed(2)}</Text>

          <Text style={styles.label}>Fecha de Registro</Text>
          <Text style={styles.value}>{formatearFecha(pedido.fechaRegistro)}</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditarPedido', { pedido })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.btnTextWhite}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={confirmarEliminacion}
          >
            <Ionicons name="trash-outline" size={18} color="#c62828" />
            <Text style={styles.btnTextRed}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 40, paddingBottom: 15, elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 4 },
  content: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2, marginBottom: 20 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelCode: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  badge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  label: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 12 },
  value: { fontSize: 15, color: '#333', fontWeight: '500', marginTop: 2 },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginTop: 4 },
  actionButtonsRow: { flexDirection: 'row', gap: 10 },
  editButton: { flex: 1, backgroundColor: '#475569', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 6, elevation: 2 },
  deleteButton: { flex: 1, backgroundColor: '#fee2e2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 6, elevation: 1, borderWidth: 1, borderColor: '#fca5a5' },
  btnTextWhite: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  btnTextRed: { color: '#c62828', fontSize: 14, fontWeight: 'bold' },
  btnBack: { backgroundColor: '#333', padding: 10, borderRadius: 8, marginTop: 10 },
  btnBackText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: COLORS.error, fontSize: 15, marginBottom: 10, textAlign: 'center' },
});