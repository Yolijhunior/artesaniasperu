import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { usePedidos } from '../hooks/usePedidos';
import { EditarPedidoCard } from '../components/EditarPedidoCard';
import { validarPedidoForm } from '../utils/validations';

const estadosDisponibles = [
  { label: 'PENDIENTE', color: '#f59e0b', icon: 'time-outline' },
  { label: 'EN PROCESO', color: '#0284c7', icon: 'sync-outline' },
  { label: 'ENTREGADO', color: '#16a34a', icon: 'checkmark-circle-outline' },
  { label: 'CANCELADO', color: '#dc2626', icon: 'close-circle-outline' }
];

export const EditarPedidoScreen = ({ route, navigation }: any) => {
  const { pedido, onActualizar } = route.params || {};
  const { actualizarPedido, recargarPedidos } = usePedidos() as any;

  const [productosApiLocal, setProductosApiLocal] = useState<any[]>([]);
  const [cargandoApi, setCargandoApi] = useState(true);
  
  const [clienteNombre, setClienteNombre] = useState(pedido?.clienteNombre || '');
  const [erroresForm, setErroresForm] = useState<{ [key: string]: string }>({});
  
  const productosIniciales = Array.isArray(pedido?.productos) && pedido.productos.length > 0
    ? pedido.productos.map((p: any) => {
        let nombreLimpio = p.nombre || '';
        nombreLimpio = nombreLimpio.replace(/^\d+x\s*/, '');
        return { ...p, nombre: nombreLimpio, cantidad: p.cantidad || 1 };
      })
    : (pedido?.producto 
        ? [{ 
            nombre: String(pedido.producto).replace(/^\d+x\s*/, ''), 
            precio: Number(pedido?.precio || 0) / (pedido?.cantidad || 1), 
            cantidad: pedido?.cantidad || 1 
          }] 
        : []);
  
  const [productosSeleccionados, setProductosSeleccionados] = useState<any[]>(productosIniciales);
  const [estado, setEstado] = useState(pedido?.estado || 'PENDIENTE');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    fetch('https://6a6ffcdb55c0ce38c325cb2b.mockapi.io/api/v1/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductosApiLocal(data);
        }
        setCargandoApi(false);
      })
      .catch(error => {
        console.error("Error al cargar MockAPI:", error);
        setCargandoApi(false);
      });
  }, []);

  const precioTotalFinal = productosSeleccionados.reduce((acc, curr) => {
    const precioProd = Number(curr.precio || curr.price || 0);
    const cantProd = Number(curr.cantidad || 1);
    return acc + (precioProd * cantProd);
  }, 0);

  const handleToggleProducto = (item: any) => {
    const nombreProd = item.name || item.title || item.nombre || 'Producto sin nombre';
    const precioProd = Number(item.price || item.precio || 0);

    const existeIndex = productosSeleccionados.findIndex((p: any) => p.nombre === nombreProd);
    if (existeIndex >= 0) {
      const nuevos = [...productosSeleccionados];
      nuevos.splice(existeIndex, 1);
      setProductosSeleccionados(nuevos);
    } else {
      setProductosSeleccionados([...productosSeleccionados, { nombre: nombreProd, precio: precioProd, cantidad: 1 }]);
    }
  };

  const handleCambiarCantidadProducto = (nombreProd: string, delta: number) => {
    setProductosSeleccionados(productosSeleccionados.map((p: any) => {
      if (p.nombre === nombreProd) {
        const nuevaCant = Math.max(1, (p.cantidad || 1) + delta);
        return { ...p, cantidad: nuevaCant };
      }
      return p;
    }));
  };

  const handleEliminarProducto = (nombreProd: string) => {
    setProductosSeleccionados(productosSeleccionados.filter((p: any) => p.nombre !== nombreProd));
  };

  const handleGuardar = async () => {
    const nombresProductosTexto = productosSeleccionados
      .map(p => `${p.cantidad || 1}x ${p.nombre}`)
      .join(', ');

    const cantidadTotalReal = productosSeleccionados.reduce((acc, p) => acc + Number(p.cantidad || 1), 0);
    
    const precioCalculadoReal = productosSeleccionados.reduce((acc, curr) => {
      const precioProd = Number(curr.precio || curr.price || 0);
      const cantProd = Number(curr.cantidad || 1);
      return acc + (precioProd * cantProd);
    }, 0);

    const resultadoValidacion = validarPedidoForm({
      clienteNombre,
      producto: nombresProductosTexto,
      cantidad: String(cantidadTotalReal),
      precio: String(precioCalculadoReal),
    });

    if (!resultadoValidacion.esValido) {
      setErroresForm(resultadoValidacion.errores);
      const primerError = Object.values(resultadoValidacion.errores)[0];
      Alert.alert('Datos inválidos', primerError);
      return;
    }
    setErroresForm({});

    if (productosSeleccionados.length === 0) {
      Alert.alert('Campos incompletos', 'Por favor selecciona al menos un producto.');
      return;
    }

    try {
      const pedidoActualizado = {
        ...pedido,
        clienteNombre: clienteNombre.trim(),
        producto: nombresProductosTexto,
        productos: productosSeleccionados,
        cantidad: cantidadTotalReal,
        precio: precioCalculadoReal,
        estado,
      };

      if (typeof actualizarPedido === 'function') {
        await actualizarPedido(pedido.id, pedidoActualizado);
      }

      if (typeof recargarPedidos === 'function') {
        await recargarPedidos();
      }

      if (typeof onActualizar === 'function') {
        onActualizar(pedidoActualizado);
      }

      Alert.alert('Éxito', 'Pedido actualizado correctamente.', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
          } 
        }
      ]);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert('Error', 'No se pudo actualizar el registro en la base de datos.');
    }
  };

  return (
    <EditarPedidoCard 
      pedidoId={pedido?.id}
      navigation={navigation}
      clienteNombre={clienteNombre}
      setClienteNombre={setClienteNombre}
      errorCliente={erroresForm.clienteNombre || ''}
      productosSeleccionados={productosSeleccionados}
      estado={estado}
      setEstado={setEstado}
      mostrarDropdown={mostrarDropdown}
      setMostrarDropdown={setMostrarDropdown}
      cargandoApi={cargandoApi}
      productosApiLocal={productosApiLocal}
      precioTotalFinal={precioTotalFinal}
      estadosDisponibles={estadosDisponibles}
      handleToggleProducto={handleToggleProducto}
      handleCambiarCantidadProducto={handleCambiarCantidadProducto}
      handleEliminarProducto={handleEliminarProducto}
      handleGuardar={handleGuardar}
    />
  );
};