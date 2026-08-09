import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCatalogApi } from '../hooks/useCatalogApi';
import { ProductoApi } from '../../infrastructure/services/apiService';

interface ItemSeleccionado {
  producto: ProductoApi;
  cantidad: number;
}

export const CatalogoApiScreen = ({ navigation }: any) => {
  const { productos, cargando, error, fetchProductos } = useCatalogApi();
  const [seleccionados, setSeleccionados] = useState<ItemSeleccionado[]>([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAgregarAlPedido = (item: ProductoApi) => {
    setSeleccionados(prev => {
      const existe = prev.find(p => p.producto.id === item.id);
      if (existe) {
        return prev.map(p => p.producto.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p);
      } else {
        return [...prev, { producto: item, cantidad: 1 }];
      }
    });
  };

  const totalItemsCarrito = seleccionados.reduce((acc, curr) => acc + curr.cantidad, 0);

  const irAlFormularioConSeleccion = () => {
    const primerSeleccion = seleccionados.length > 0 ? seleccionados[0].producto : null;
    navigation.navigate('FormPedido', { productoSeleccionado: primerSeleccion });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Catálogo de Artesanías</Text>
        <TouchableOpacity style={styles.btnReload} onPress={fetchProductos}>
          <Text style={styles.btnReloadText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => {
                handleAgregarAlPedido(item);
                navigation.navigate('FormPedido', { productoSeleccionado: item });
              }}
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              
              <View style={styles.cardContent}>
                <Text style={styles.artesano}>{item.artesano}</Text>
                <Text style={styles.categoria}>{item.category} • {item.region}</Text>
                <Text style={styles.productTitle}>{item.title}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.price}>S/ {item.price.toFixed(2)}</Text>
                  <Text style={styles.refText}>*Toca para pedir</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos disponibles.</Text>
          }
        />
      )}

      {totalItemsCarrito > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={irAlFormularioConSeleccion}
        >
          <Ionicons name="cart" size={22} color="#fff" />
          <Text style={styles.floatingButtonText}>Ir al Pedido ({totalItemsCarrito})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 15 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' },
  btnReload: { backgroundColor: '#d32f2f', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  btnReloadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, overflow: 'hidden', elevation: 3 },
  productImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 15 },
  artesano: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  categoria: { fontSize: 12, color: '#666', marginTop: 2 },
  productTitle: { fontSize: 15, fontWeight: 'bold', color: '#111', marginTop: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#d32f2f' },
  refText: { fontSize: 11, color: '#d32f2f', fontStyle: 'italic', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#d32f2f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    gap: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});