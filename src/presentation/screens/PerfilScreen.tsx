import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { auth } from '../../infrastructure/firebase/firebaseConfig';

export const PerfilScreen = ({ route, navigation }: any) => {
  // Recogemos los parámetros enviados desde el menú, o usamos valores por defecto seguros
  const userName = route?.params?.userName || auth.currentUser?.displayName || 'Usuario Artesano';
  const userEmail = route?.params?.userEmail || auth.currentUser?.email || 'correo@ejemplo.com';
  const totalVentas = route?.params?.totalVentas ?? 0;

  return (
    <View style={styles.container}>
      {/* Barra superior con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tarjeta de Información del Usuario */}
      <View style={styles.cardPerfil}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={50} color={COLORS.primary} />
        </View>

        <Text style={styles.nombreText}>{userName}</Text>
        <Text style={styles.emailText}>{userEmail}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="bag-check-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{totalVentas}</Text>
            <Text style={styles.statLabel}>Ventas Totales</Text>
          </View>
        </View>
      </View>

      {/* Botón para regresar al listado */}
      <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.btnVolverText}>Regresar al Listado</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardPerfil: { backgroundColor: '#fff', borderRadius: 12, padding: 25, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  nombreText: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  emailText: { fontSize: 13, color: '#757575', marginBottom: 20 },
  statsContainer: { width: '100%', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20, alignItems: 'center' },
  statBox: { alignItems: 'center', backgroundColor: '#FFF5F5', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, width: '100%', borderWidth: 1, borderColor: '#FFCDD2' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginVertical: 4 },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
  btnVolver: { backgroundColor: COLORS.primary, marginTop: 25, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnVolverText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});