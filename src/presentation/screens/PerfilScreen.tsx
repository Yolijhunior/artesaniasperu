import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const PerfilScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.title}>Emprendimiento Artesanal</Text>
        <Text style={styles.subtitle}>Gestión de Pedidos Móviles</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Versión de la App:</Text>
          <Text style={styles.value}>1.0.0 (Preliminar)</Text>
          
          <Text style={styles.label}>Arquitectura:</Text>
          <Text style={styles.value}>Clean Architecture (Por Capas)</Text>
          
          <Text style={styles.label}>Base de Datos:</Text>
          <Text style={styles.value}>SQLite Local</Text>
        </View>

        <TouchableOpacity 
          style={styles.btnLogout} 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 12, alignItems: 'center', elevation: 3 },
  avatar: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  infoContainer: { width: '100%', marginBottom: 25, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#888', marginTop: 8 },
  value: { fontSize: 14, color: '#333', fontWeight: '500' },
  btnLogout: { backgroundColor: '#dc3545', width: '100%', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnLogoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});