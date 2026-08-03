import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

interface EditarPedidoCardProps {
  pedidoId: any;
  navigation: any;
  clienteNombre: string;
  setClienteNombre: (val: string) => void;
  errorCliente: string;
  productosSeleccionados: any[];
  estado: string;
  setEstado: (val: string) => void;
  mostrarDropdown: boolean;
  setMostrarDropdown: (val: boolean) => void;
  cargandoApi: boolean;
  productosApiLocal: any[];
  precioTotalFinal: number;
  estadosDisponibles: any[];
  handleToggleProducto: (item: any) => void;
  handleCambiarCantidadProducto: (nombreProd: string, delta: number) => void;
  handleEliminarProducto: (nombreProd: string) => void;
  handleGuardar: () => void;
}

export const EditarPedidoCard = ({
  pedidoId,
  navigation,
  clienteNombre,
  setClienteNombre,
  errorCliente,
  productosSeleccionados,
  estado,
  setEstado,
  mostrarDropdown,
  setMostrarDropdown,
  cargandoApi,
  productosApiLocal,
  precioTotalFinal,
  estadosDisponibles,
  handleToggleProducto,
  handleCambiarCantidadProducto,
  handleEliminarProducto,
  handleGuardar,
}: EditarPedidoCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Pedido #{pedidoId}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Cliente *</Text>
        <TextInput 
          style={[styles.input, errorCliente ? { borderColor: '#dc2626' } : null]} 
          value={clienteNombre} 
          onChangeText={setClienteNombre} 
          placeholder="Nombre del cliente" 
          placeholderTextColor="#888"
        />
        {errorCliente ? <Text style={styles.errorText}>{errorCliente}</Text> : null}

        <Text style={styles.label}>Catálogo de Productos (Selecciona o desmarca) *</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => setMostrarDropdown(!mostrarDropdown)}
        >
          <Text style={[styles.dropdownText, productosSeleccionados.length === 0 && {color: '#888'}]} numberOfLines={1}>
            {productosSeleccionados.length > 0 
              ? `${productosSeleccionados.length} producto(s) seleccionado(s)` 
              : 'Selecciona productos del catálogo...'}
          </Text>
          <Ionicons name={mostrarDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
        </TouchableOpacity>

        {mostrarDropdown && (
          <View style={styles.dropdownList}>
            {cargandoApi ? (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Cargando productos de la API...</Text>
              </View>
            ) : productosApiLocal.length > 0 ? (
              productosApiLocal.map((item: any, index: number) => {
                const nombreProd = item.name || item.title || item.nombre || 'Producto sin nombre';
                const precioProd = Number(item.price || item.precio || 0);
                const estaSeleccionado = productosSeleccionados.some((p: any) => p.nombre === nombreProd);
                
                return (
                  <TouchableOpacity 
                    key={item.id || index} 
                    style={[styles.dropdownItem, estaSeleccionado && styles.dropdownItemActive]} 
                    onPress={() => handleToggleProducto(item)}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8}}>
                      <Ionicons 
                        name={estaSeleccionado ? "checkbox" : "square-outline"} 
                        size={18} 
                        color={estaSeleccionado ? COLORS.primary : "#666"} 
                      />
                      <Text style={[styles.dropdownItemText, estaSeleccionado && {fontWeight: 'bold'}]} numberOfLines={1}>
                        {nombreProd}
                      </Text>
                    </View>
                    <Text style={styles.dropdownItemPrice}>S/ {precioProd.toFixed(2)}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>No se encontraron productos.</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.label}>Productos Elegidos y Cantidades por ítem:</Text>
        {productosSeleccionados.length > 0 ? (
          productosSeleccionados.map((prod, index) => (
            <View key={index} style={styles.selectedProductCard}>
              <View style={{flex: 1, marginRight: 8}}>
                <Text style={styles.selectedProductTitle} numberOfLines={2}>{prod.nombre}</Text>
                <Text style={styles.selectedProductPrice}>S/ {Number(prod.precio).toFixed(2)} c/u</Text>
              </View>

              <View style={styles.productControlRow}>
                <View style={styles.miniCounterContainer}>
                  <TouchableOpacity 
                    style={styles.miniCounterBtn} 
                    onPress={() => handleCambiarCantidadProducto(prod.nombre, -1)}
                  >
                    <Ionicons name="remove" size={14} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.miniCounterText}>{prod.cantidad || 1}</Text>
                  <TouchableOpacity 
                    style={styles.miniCounterBtn} 
                    onPress={() => handleCambiarCantidadProducto(prod.nombre, 1)}
                  >
                    <Ionicons name="add" size={14} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  onPress={() => handleEliminarProducto(prod.nombre)}
                  style={styles.deleteProductBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyProductsText}>No hay productos seleccionados. Elige al menos uno arriba.</Text>
        )}

        <View style={styles.rowPriceFinal}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Precio Total Global (S/) *</Text>
            <TextInput 
              style={[styles.input, styles.inputDisabled]} 
              value={precioTotalFinal.toFixed(2)} 
              editable={false} 
              placeholder="0.00" 
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <Text style={styles.label}>Estado del Pedido</Text>
        <View style={styles.estadoGridContainer}>
          {estadosDisponibles.map((est) => {
            const activo = estado === est.label;
            return (
              <TouchableOpacity 
                key={est.label} 
                style={[
                  styles.estadoButtonGrid, 
                  activo && { backgroundColor: est.color, borderColor: est.color }
                ]} 
                onPress={() => setEstado(est.label)}
              >
                <Ionicons 
                  name={est.icon as any} 
                  size={16} 
                  color={activo ? '#fff' : est.color} 
                />
                <Text style={[styles.estadoTextGrid, activo && styles.estadoTextGridActive]} numberOfLines={1}>
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
  content: { padding: 15, paddingBottom: 80 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 5, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, fontSize: 14, color: '#333' },
  inputDisabled: { backgroundColor: '#f9fafb', color: '#6b7280' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4, fontWeight: '600' },
  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  dropdownText: { fontSize: 14, color: '#333', flex: 1, marginRight: 10 },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginTop: 4, maxHeight: 180, elevation: 3 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemActive: { backgroundColor: '#f0fdf4' },
  dropdownItemText: { fontSize: 13, color: '#333', flex: 1 },
  dropdownItemPrice: { fontSize: 13, fontWeight: 'bold', color: '#2563eb', marginLeft: 10 },
  selectedProductCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', marginTop: 6, elevation: 1 },
  selectedProductTitle: { fontSize: 13, fontWeight: '600', color: '#333' },
  selectedProductPrice: { fontSize: 12, color: '#666', marginTop: 2 },
  productControlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniCounterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 6, padding: 2, borderWidth: 1, borderColor: '#d1d5db' },
  miniCounterBtn: { padding: 4, backgroundColor: '#fff', borderRadius: 4, elevation: 1 },
  miniCounterText: { fontSize: 13, fontWeight: 'bold', marginHorizontal: 8, color: '#333' },
  deleteProductBtn: { padding: 6, backgroundColor: '#fee2e2', borderRadius: 6 },
  emptyProductsText: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 4 },
  rowPriceFinal: { flexDirection: 'row', marginTop: 5 },
  estadoGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5, gap: 8 },
  estadoButtonGrid: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', elevation: 1 },
  estadoTextGrid: { fontSize: 12, fontWeight: '600', color: '#555' },
  estadoTextGridActive: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 10, gap: 8, marginTop: 30, elevation: 2 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});