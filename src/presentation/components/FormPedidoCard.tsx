import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';
import { ProductoApi } from '../../infrastructure/services/apiService';
import { CustomButton } from '../../presentation/components/CustomButton';

interface ItemSeleccionado {
  producto: ProductoApi;
  cantidad: number;
}

interface FormPedidoContentProps {
  clienteNombre: string;
  setClienteNombre: (val: string) => void;
  errorCliente: string;
  itemsSeleccionados: ItemSeleccionado[];
  estadoSeleccionado: string;
  setEstadoSeleccionado: (val: string) => void;
  estadosDisponibles: Array<{ label: string; color: string; textDisplay?: string }>;
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  listaProductos: ProductoApi[];
  handleSeleccionarProducto: (prod: ProductoApi) => void;
  handleModificarCantidad: (id: string, delta: number) => void;
  handleGuardarPedido: () => void;
}

export const FormPedidoContent = ({
  clienteNombre,
  setClienteNombre,
  errorCliente,
  itemsSeleccionados,
  estadoSeleccionado,
  setEstadoSeleccionado,
  estadosDisponibles,
  modalVisible,
  setModalVisible,
  listaProductos,
  handleSeleccionarProducto,
  handleModificarCantidad,
  handleGuardarPedido,
}: FormPedidoContentProps) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Pedido</Text>

      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. María Pérez" 
        placeholderTextColor="#888"
        value={clienteNombre} 
        onChangeText={setClienteNombre} 
      />
      {errorCliente ? <Text style={styles.errorText}>{errorCliente}</Text> : null}

      <Text style={styles.label}>Seleccionar Productos del Catálogo</Text>
      <TouchableOpacity 
        style={styles.selectButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectTextPlaceholder}>+ Añadir productos (puedes elegir varios)</Text>
      </TouchableOpacity>

      {itemsSeleccionados.map((item) => (
        <View key={item.producto.id} style={styles.itemRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.itemTitle}>{item.producto.title}</Text>
            <Text style={styles.itemPrecio}>S/ {item.producto.price} c/u</Text>
          </View>
          <View style={styles.cantidadContainer}>
            <TouchableOpacity 
              style={styles.btnMenos} 
              onPress={() => handleModificarCantidad(item.producto.id, -1)}
            >
              <Text style={styles.btnMenosText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.txtCantidad}>{item.cantidad}</Text>

            <TouchableOpacity 
              style={styles.btnMas} 
              onPress={() => handleModificarCantidad(item.producto.id, 1)}
            >
              <Text style={styles.btnMasText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.label}>Estado del Pedido</Text>
      <View style={styles.botonesEstadoContainer}>
        {estadosDisponibles.map((est) => {
          const seleccionado = estadoSeleccionado === est.label;
          return (
            <TouchableOpacity
              key={est.label}
              style={[
                styles.btnEstadoItem, 
                { backgroundColor: seleccionado ? est.color : '#E0E0E0' }
              ]}
              onPress={() => setEstadoSeleccionado(est.label)}
            >
              <Text style={[styles.textoBtnEstado, { color: seleccionado ? '#FFF' : '#333' }]}>
                {est.textDisplay || est.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Catálogo de Artesanías</Text>
            <FlatList
              data={listaProductos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => handleSeleccionarProducto(item)}
                >
                  <Text style={styles.modalItemTitle}>{item.title}</Text>
                  <Text style={styles.modalItemSubtitle}>S/ {item.price} - {item.category}</Text>
                  <Text style={styles.agregarTexto}>+ Toca para agregar</Text>
                </TouchableOpacity>
              )}
            />
            <CustomButton 
              title="Listo / Cerrar" 
              onPress={() => setModalVisible(false)} 
              color="#E53935" 
            />
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 20 }}>
        <CustomButton 
          title="Guardar Pedido" 
          onPress={handleGuardarPedido} 
          color="#E53935" 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFF9F9', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#D32F2F', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#424242', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#FFCDD2', borderRadius: 8, padding: 10, backgroundColor: '#FFF', color: '#333' },
  errorText: { color: '#D32F2F', fontSize: 12, marginTop: 4 },
  botonesEstadoContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  btnEstadoItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginBottom: 4 },
  textoBtnEstado: { fontSize: 11, fontWeight: 'bold' },
  selectButton: { borderWidth: 1, borderColor: '#E53935', borderStyle: 'dashed', borderRadius: 8, padding: 12, backgroundColor: '#FFEBEE', alignItems: 'center', marginVertical: 8 },
  selectTextPlaceholder: { color: '#C62828', fontWeight: '600' },
  itemRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FFCDD2', alignItems: 'center', marginTop: 8 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: '#212121' },
  itemPrecio: { fontSize: 11, color: '#757575', marginTop: 2 },
  cantidadContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 6, borderWidth: 1, borderColor: '#E0E0E0', padding: 2 },
  btnMenos: { backgroundColor: 'rgba(244, 67, 54, 0.2)', width: 28, height: 28, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  btnMenosText: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
  btnMas: { backgroundColor: 'rgba(33, 150, 243, 0.2)', width: 28, height: 28, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  btnMasText: { color: '#1976D2', fontSize: 16, fontWeight: 'bold' },
  txtCantidad: { marginHorizontal: 10, fontSize: 14, fontWeight: 'bold', color: '#333', minWidth: 16, textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: '#FFF9F9', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#D32F2F' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#FFEBEE' },
  modalItemTitle: { fontSize: 15, fontWeight: '600', color: '#212121' },
  modalItemSubtitle: { fontSize: 12, color: '#757575' },
  agregarTexto: { fontSize: 12, color: '#E53935', fontWeight: 'bold', marginTop: 4 },
});