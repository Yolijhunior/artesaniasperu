import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { usePedidos } from '../hooks/usePedidos';
import { validarNombre } from '../utils/validations';
import { ESTADOS_PEDIDO } from '../utils/constants';
import { getCatalogoProductos, ProductoApi } from '../../infrastructure/services/apiService';
import { CustomButton } from '../components/CustomButton';

interface ItemSeleccionado {
  producto: ProductoApi;
  cantidad: number;
}

export const FormPedidoScreen = ({ navigation }: any) => {
  const { registrarNuevoPedido, recargarPedidos } = usePedidos();

  const [clienteNombre, setClienteNombre] = useState('');
  const [itemsSeleccionados, setItemsSeleccionados] = useState<ItemSeleccionado[]>([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<any>(ESTADOS_PEDIDO.PENDIENTE);
  
  const [errorCliente, setErrorCliente] = useState('');
  const [listaProductos, setListaProductos] = useState<ProductoApi[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const estadosDisponibles = [
    { label: ESTADOS_PEDIDO.PENDIENTE, color: '#FF9800' },     // Naranja
    { label: ESTADOS_PEDIDO.EN_PROCESO, color: '#2196F3', textDisplay: 'EN PROCESO' }, // Azul con espacio
    { label: ESTADOS_PEDIDO.ENTREGADO, color: '#4CAF50' },     // Verde
    { label: ESTADOS_PEDIDO.CANCELADO, color: '#F44336' },     // Rojo
  ];

  useEffect(() => {
    const cargarProductosApi = async () => {
      try {
        const data = await getCatalogoProductos();
        setListaProductos(data);
      } catch (error) {
        console.error('No se pudo cargar el catálogo para el formulario', error);
      }
    };
    cargarProductosApi();
  }, []);

  const handleSeleccionarProducto = (prod: ProductoApi) => {
    setItemsSeleccionados(prev => {
      const existe = prev.find(item => item.producto.id === prod.id);
      if (existe) {
        return prev.map(item => 
          item.producto.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prev, { producto: prod, cantidad: 1 }];
      }
    });
  };

  const handleModificarCantidad = (id: string, delta: number) => {
    setItemsSeleccionados(prev => {
      return prev.map(item => {
        if (item.producto.id === id) {
          const nuevaCantidad = item.cantidad + delta;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
        }
        return item;
      }).filter(Boolean) as ItemSeleccionado[];
    });
  };

  const handleGuardarPedido = async () => {
    const valNombre = validarNombre(clienteNombre);
    if (!valNombre.esValido) {
      setErrorCliente(valNombre.mensaje);
      return;
    }
    setErrorCliente('');

    if (itemsSeleccionados.length === 0) {
      Alert.alert('Atención', 'Debe seleccionar al menos un producto artesanal.');
      return;
    }

    const detalleProductos = itemsSeleccionados
      .map(i => `${i.cantidad}x ${i.producto.title}`)
      .join(', ');

    const precioTotal = itemsSeleccionados.reduce((acc, i) => acc + (i.producto.price * i.cantidad), 0);
    const cantidadTotal = itemsSeleccionados.reduce((acc, i) => acc + i.cantidad, 0);

    const nuevoPedido = {
      clienteNombre: clienteNombre.trim(),
      producto: detalleProductos,
      cantidad: cantidadTotal,
      precio: precioTotal,
      estado: estadoSeleccionado,
      fechaRegistro: new Date().toLocaleDateString(),
    };

    try {
      await registrarNuevoPedido(nuevoPedido);
      await recargarPedidos();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el pedido localmente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Pedido</Text>

      <Text style={styles.label}>Nombre del Cliente</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. María Pérez" 
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

      {/* Modal para Productos */}
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
            
            {/* Usando CustomButton para cerrar el modal */}
            <CustomButton 
              title="Listo / Cerrar" 
              onPress={() => setModalVisible(false)} 
              color="#E53935" 
            />
          </View>
        </View>
      </Modal>

      {/* Usando CustomButton para guardar el pedido */}
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
  input: { borderWidth: 1, borderColor: '#FFCDD2', borderRadius: 8, padding: 10, backgroundColor: '#FFF' },
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