import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useCatalogApi } from '../hooks/useCatalogApi';

export const CatalogoApiScreen = () => {
  const { productos, cargando, error, fetchProductos } = useCatalogApi();

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Catálogo de Artesanías</Text>
        <TouchableOpacity style={styles.btnReload} onPress={fetchProductos}>
          <Text style={styles.btnReloadText}>Actualizar</Text>
        </TouchableOpacity>
      </View>

      {cargando && <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            
            <View style={styles.cardContent}>
              <Text style={styles.artesano}>{item.artesano}</Text>
              <Text style={styles.categoria}>{item.category} • {item.region}</Text>
              <Text style={styles.productTitle}>{item.title}</Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.price}>S/ {item.price.toFixed(2)}</Text>
                <Text style={styles.refText}>*Precio referencial</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !cargando && !error ? <Text style={styles.emptyText}>No hay productos disponibles.</Text> : null
        }
      />
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
  refText: { fontSize: 11, color: '#888', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});