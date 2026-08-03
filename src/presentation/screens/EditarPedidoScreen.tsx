import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { usePedidos } from '../hooks/usePedidos';
import { useCatalogApi } from '../hooks/useCatalogApi';

export const EditarPedidoScreen = ({ route, navigation }: any) => {
  const { pedido } = route.params || {};
  const { actualizarPedido, recargarPedidos } = usePedidos() as any;
  const { products } = useCatalogApi() as any;

  const [clienteNombre, setClienteNombre] = useState(pedido?.clienteNombre || '');
  const [producto, setProducto] = useState(pedido?.producto || '');
  const [cantidad, setCantidad] = useState(pedido?.cantidad ? Number(pedido.cantidad) : 1);
  const [precio, setPrecio] = useState(pedido?.precio ? String(pedido.precio) : '');
  const [estado, setEstado] = useState(pedido?.estado || 'PENDIENTE');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const estadosDisponibles = [
    { label: 'PENDIENTE', color: '#f59e0b', icon: 'time-outline' },
    { label: 'EN PROCESO', color: '#0284c7', icon: 'sync-outline' },
    { label: 'ENTREGADO', color: '#16a34a', icon: 'checkmark-circle-outline' },
    { label: 'CANCELADO', color: '#dc2626', icon: 'close-circle-outline' }
  ];

  const handleGuardar = async () => {
    if (!clienteNombre.trim() || !producto.trim() || !String(cantidad).trim() || !precio.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa un número válido mayor a 0 para la cantidad.');
      return;
    }

    try {
      const pedidoActualizado = {
        ...pedido,
        clienteNombre,
        producto,
        cantidad: Number(cantidad),
        precio: Number(precio),
        estado,
      };

      if (typeof actualizarPedido === 'function') {
        await actualizarPedido(pedido.id, pedidoActualizado);
      }

      if (typeof recargarPedidos === 'function') {
        recargarPedidos();
      }

      Alert.alert('Éxito', 'Pedido actualizado correctamente en la base de datos.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el registro en la base de datos.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Pedido #{pedido?.id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Cliente *</Text>
        <TextInput 
          style={styles.input} 
          value={clienteNombre} 
          onChangeText={setClienteNombre} 
          placeholder="Nombre del cliente" 
        />

        <Text style={styles.label}>Producto * (Seleccionar de API)</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => setMostrarDropdown(!mostrarDropdown)}
        >
          <Text style={[styles.dropdownText, !producto && {color: '#888'}]} numberOfLines={1}>
            {producto || 'Selecciona un producto del catálogo...'}
          </Text>
          <Ionicons name={mostrarDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>

        {mostrarDropdown && (
          <View style={styles.dropdownList}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item: any, index: number) => {
                const nombreProd = item.title || item.nombre || item.name || 'Producto sin nombre';
                const precioProd = item.price || item.precio || 0;
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.dropdownItem} 
                    onPress={() => {
                      setProducto(nombreProd);
                      setPrecio(String(precioProd));
                      setMostrarDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText} numberOfLines={1}>{nombreProd}</Text>
                    <Text style={styles.dropdownItemPrice}>S/ {Number(precioProd).toFixed(2)}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Cargando productos de la API...</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Cantidad *</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterBtn} 
                onPress={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                <Ionicons name="remove" size={18} color="#333" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{cantidad}</Text>
              <TouchableOpacity 
                style={styles.counterBtn} 
                onPress={() => setCantidad(cantidad + 1)}
              >
                <Ionicons name="add" size={18} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Precio Unitario (S/) *</Text>
            <TextInput 
              style={[styles.input, styles.inputDisabled]} 
              value={precio} 
              editable={false} 
              placeholder="0.00" 
            />
          </View>
        </View>

        <Text style={styles.label}>Estado del Pedido</Text>
        <View style={styles.estadoContainer}>
          {estadosDisponibles.map((est) => {
            const activo = estado === est.label;
            return (
              <TouchableOpacity 
                key={est.label} 
                style={[
                  styles.estadoButtonLarge, 
                  activo && { backgroundColor: est.color, borderColor: est.color }
                ]} 
                onPress={() => setEstado(est.label)}
              >
                <Ionicons 
                  name={est.icon as any} 
                  size={18} 
                  color={activo ? '#fff' : est.color} 
                />
                <Text style={[styles.estadoTextLarge, activo && styles.estadoTextLargeActive]}>
                  {est.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 40, paddingBottom: 15, elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 4 },
  content: { padding: 15 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 5, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 14, color: '#333' },
  inputDisabled: { backgroundColor: '#f9fafb', color: '#6b7280' },
  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  dropdownText: { fontSize: 14, color: '#333', flex: 1, marginRight: 10 },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginTop: 4, maxHeight: 180, elevation: 3 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 13, color: '#333', flex: 1 },
  dropdownItemPrice: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginLeft: 10 },
  row: { flexDirection: 'row', gap: 10 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, height: 42, justifyContent: 'space-between', paddingHorizontal: 5 },
  counterBtn: { padding: 6, backgroundColor: '#f3f4f6', borderRadius: 6 },
  counterText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  estadoContainer: { gap: 8, marginTop: 5 },
  estadoButtonLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', elevation: 1 },
  estadoTextLarge: { fontSize: 13, fontWeight: '600', color: '#555' },
  estadoTextLargeActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 8, marginTop: 30, elevation: 2 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});