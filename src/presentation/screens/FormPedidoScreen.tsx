import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { usePedidos } from '../hooks/usePedidos';
import { validarNombre } from '../utils/validations';
import { ESTADOS_PEDIDO } from '../utils/constants';
import { getCatalogoProductos, ProductoApi } from '../../infrastructure/services/apiService';
import { FormPedidoContent } from '../components/FormPedidoCard'; // <-- Ruta correcta hacia components
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
    { label: ESTADOS_PEDIDO.PENDIENTE, color: '#FF9800' }, 
    { label: ESTADOS_PEDIDO.EN_PROCESO, color: '#2196F3', textDisplay: 'EN PROCESO' }, 
    { label: ESTADOS_PEDIDO.ENTREGADO, color: '#4CAF50' }, 
    { label: ESTADOS_PEDIDO.CANCELADO, color: '#F44336' }, 
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
    <FormPedidoContent 
      clienteNombre={clienteNombre}
      setClienteNombre={setClienteNombre}
      errorCliente={errorCliente}
      itemsSeleccionados={itemsSeleccionados}
      estadoSeleccionado={estadoSeleccionado}
      setEstadoSeleccionado={setEstadoSeleccionado}
      estadosDisponibles={estadosDisponibles}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      listaProductos={listaProductos}
      handleSeleccionarProducto={handleSeleccionarProducto}
      handleModificarCantidad={handleModificarCantidad}
      handleGuardarPedido={handleGuardarPedido}
    />
  );
};