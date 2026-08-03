import React, { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal, Animated, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePedidos } from '../hooks/usePedidos';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export const ListadoPedidosScreen = ({ route, navigation }: any) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [menuVisible, setMenuVisible] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  
  const slideAnim = useRef(new Animated.Value(-280)).current;

  const userName = route?.params?.userName || 'Juan';
  const { pedidos, cargando, error, eliminarPedido, recargarPedidos } = usePedidos() as any;

  useFocusEffect(
    useCallback(() => {
      if (typeof recargarPedidos === 'function') {
        recargarPedidos();
      }
    }, [recargarPedidos])
  );

  const abrirMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  };

  const cerrarMenu = () => {
    Animated.timing(slideAnim, { toValue: -280, duration: 200, useNativeDriver: true }).start(() => {
      setMenuVisible(false);
    });
  };

  const listaPedidosSegura = Array.isArray(pedidos) ? pedidos : [];
  const pedidosFiltrados = listaPedidosSegura.filter(item => {
    const textoBusqueda = (busqueda || '').toLowerCase().trim();
    const cliente = (item.clienteNombre || '').toLowerCase();
    const producto = (item.producto || '').toLowerCase();

    const coincideTexto = cliente.includes(textoBusqueda) || producto.includes(textoBusqueda);
    
    let coincideEstado = true;
    if (filtroEstado !== 'TODOS') {
      const estadoItem = String(item.estado || '');
      if (filtroEstado === 'EN PROCESO') {
        coincideEstado = estadoItem === 'EN PROCESO' || estadoItem === 'EN_PROCESO';
      } else {
        coincideEstado = estadoItem === filtroEstado;
      }
    }

    return coincideTexto && coincideEstado;
  });

  const confirmarCierreSesion = () => {
    cerrarMenu();
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  const confirmarEliminacion = (id?: number) => {
    if (!id) return;
    Alert.alert('Eliminar Pedido', '¿Estás seguro de eliminar este pedido local?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        onPress: async () => {
          if (typeof eliminarPedido === 'function') {
            await eliminarPedido(id);
            if (typeof recargarPedidos === 'function') recargarPedidos();
          }
        }, 
        style: 'destructive' 
      },
    ]);
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

  const botonesFila1 = [
    { label: 'TODOS', color: '#424242', icon: 'list-outline' },
    { label: 'PENDIENTE', color: '#FF9800', icon: 'time-outline' }
  ];

  const botonesFila2 = [
    { label: 'EN PROCESO', color: '#2196F3', icon: 'sync-outline' },
    { label: 'ENTREGADO', color: '#4CAF50', icon: 'checkmark-circle-outline' },
    { label: 'CANCELADO', color: '#F44336', icon: 'close-circle-outline' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topHeaderNoCard}>
        <TouchableOpacity style={styles.headerIconButton} onPress={abrirMenu}>
          <Ionicons name="menu" size={28} color="#333333" />
        </TouchableOpacity>
        <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
      </View>

      <Text style={styles.welcomeSubtitle}>¡Hola, {userName}!</Text>

      <View style={styles.tabsBar}>
        <TouchableOpacity style={[styles.tabButton, pestanaActiva === 'inicio' && styles.tabButtonActive]} onPress={() => setPestanaActiva('inicio')}>
          <Ionicons name="home" size={22} color={pestanaActiva === 'inicio' ? COLORS.primary : '#666'} />
          <Text style={[styles.tabText, pestanaActiva === 'inicio' && styles.tabTextActive]}>Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabButton, pestanaActiva === 'catalogo' && styles.tabButtonActive]} onPress={() => { setPestanaActiva('catalogo'); navigation.navigate('CatalogoApi'); }}>
          <Ionicons name="storefront-outline" size={22} color={pestanaActiva === 'catalogo' ? COLORS.primary : '#666'} />
          <Text style={[styles.tabText, pestanaActiva === 'catalogo' && styles.tabTextActive]}>Catálogo</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.searchInput} 
        placeholder="Buscar por cliente o producto..." 
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <View style={styles.filtrosContenedorGrid}>
        <View style={styles.filaFiltros}>
          {botonesFila1.map((item) => {
            const activo = filtroEstado === item.label;
            return (
              <TouchableOpacity key={item.label} style={[styles.filterChipGrid, activo && { backgroundColor: item.color, borderColor: item.color }]} onPress={() => setFiltroEstado(item.label)}>
                <Ionicons name={item.icon as any} size={15} color={activo ? '#ffffff' : item.color} />
                <Text style={[styles.filterText, activo && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.filaFiltros}>
          {botonesFila2.map((item) => {
            const activo = filtroEstado === item.label;
            return (
              <TouchableOpacity key={item.label} style={[styles.filterChipGrid, activo && { backgroundColor: item.color, borderColor: item.color }]} onPress={() => setFiltroEstado(item.label)}>
                <Ionicons name={item.icon as any} size={15} color={activo ? '#ffffff' : item.color} />
                <Text style={[styles.filterText, activo && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {cargando && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => {
          const badgeInfo = getBadgeStyle(item.estado);
          const estadoTextoLimpio = item.estado === 'EN_PROCESO' ? 'EN PROCESO' : item.estado;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cliente}>{item.clienteNombre}</Text>
                <Text style={[styles.badge, { backgroundColor: badgeInfo.bg, color: badgeInfo.text }]}>{estadoTextoLimpio}</Text>
              </View>
              <Text style={styles.prodText}>Producto: {item.producto} (Cant: {item.cantidad})</Text>
              <Text style={styles.priceText}>Precio Total: S/ {((item.precio || 0) * (item.cantidad || 0)).toFixed(2)}</Text>
              <Text style={styles.fecha}>Fecha: {item.fechaRegistro}</Text>
              
              <View style={styles.actions}>
                <TouchableOpacity style={styles.btnDetail} onPress={() => navigation.navigate('DetallePedido', { pedido: item })}>
                  <Ionicons name="eye-outline" size={14} color="#fff" />
                  <Text style={styles.btnActionText}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnEdit} onPress={() => navigation.navigate('EditarPedido', { pedido: item })}>
                  <Ionicons name="create-outline" size={14} color="#fff" />
                  <Text style={styles.btnActionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnDelete} onPress={() => confirmarEliminacion(item.id)}>
                  <Ionicons name="trash-outline" size={14} color="#fff" />
                  <Text style={styles.btnActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={!cargando ? <Text style={styles.emptyText}>No se encontraron pedidos con esos criterios.</Text> : null}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('FormPedido')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={menuVisible} transparent={true} animationType="none" onRequestClose={cerrarMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={cerrarMenu} />
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitleText}>Menú de Opciones</Text>
              <TouchableOpacity onPress={cerrarMenu}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => { cerrarMenu(); navigation.navigate('CatalogoApi'); }}>
              <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Catálogo de Productos (API)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { cerrarMenu(); navigation.navigate('FormPedido'); }}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Registrar Nuevo Pedido</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItemLogout} onPress={confirmarCierreSesion}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={styles.menuItemLogoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15, paddingTop: 35 },
  topHeaderNoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, marginBottom: 8 },
  logoImage: { width: 130, height: 38 },
  headerIconButton: { padding: 2, justifyContent: 'center', alignItems: 'center' },
  welcomeSubtitle: { fontSize: 14, fontWeight: '600', color: 'rgba(0, 0, 0, 0.6)', marginBottom: 12, textAlign: 'left', marginLeft: 2 },
  tabsBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1, paddingHorizontal: 10 },
  tabButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, gap: 6, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabButtonActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: COLORS.primary, fontWeight: 'bold' },
  searchInput: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14, color: COLORS.textMain },
  filtrosContenedorGrid: { marginBottom: 14, gap: 6 },
  filaFiltros: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  filterChipGrid: { flex: 1, flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 4, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', gap: 4 },
  filterText: { fontSize: 10, fontWeight: '600', color: '#4b5563' },
  filterTextActive: { color: '#ffffff', fontWeight: 'bold' },
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
  emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40 },
  errorText: { color: COLORS.error, textAlign: 'center', marginBottom: 10 },
  fab: { position: 'absolute', right: 20, bottom: 65, backgroundColor: COLORS.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 3 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  modalOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' },
  backdrop: { flex: 1 },
  menuContainer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 15, elevation: 10, shadowColor: '#000', shadowOffset: { width: 3, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 15 },
  menuTitleText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  menuItemText: { fontSize: 14, fontWeight: '500', color: '#333' },
  menuDivider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  menuItemLogout: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  menuItemLogoutText: { fontSize: 14, fontWeight: 'bold', color: COLORS.error },
});