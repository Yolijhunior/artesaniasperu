import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { validarCorreo, validarNombre, validarPassword } from '../utils/validations';
import { initDatabase, loginUsuarioDB, registrarUsuarioDB } from '../../infrastructure/database/sqlite';

export const LoginScreen = ({ navigation }: any) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  const cambiarModo = () => {
    setIsRegistering(!isRegistering);
    setErrorForm('');
    setNombre('');
    setEmail('');
    setPassword('');
  };

  const handleAction = () => {
    setErrorForm('');

    if (!validarCorreo(email)) {
      setErrorForm('Por favor ingrese un correo electrónico válido.');
      return;
    }

    const valPass = validarPassword(password);
    if (!valPass.esValido) {
      setErrorForm(valPass.mensaje);
      return;
    }

    if (isRegistering) {
      const valNombre = validarNombre(nombre);
      if (!valNombre.esValido) {
        setErrorForm(valNombre.mensaje);
        return;
      }

      const resultadoRegistro = registrarUsuarioDB(nombre, email, password);
      if (!resultadoRegistro.success) {
        setErrorForm(resultadoRegistro.error || 'No se pudo registrar.');
        return;
      }

      Alert.alert(
        'Registro Exitoso', 
        '¡Cuenta creada con éxito! Ya puedes iniciar sesión.',
        [{ text: 'OK', onPress: () => cambiarModo() }]
      );
    } else {
      // Validar usuario real en SQLite
      const resultadoLogin = loginUsuarioDB(email, password);
      if (!resultadoLogin.success) {
        setErrorForm(resultadoLogin.error || 'Credenciales incorrectas.');
        return;
      }

      navigation.replace('ListadoPedidos', { userName: resultadoLogin.nombre });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />

        <Text style={styles.title}>Artesanías del Perú</Text>
        <Text style={styles.subtitle}>{isRegistering ? 'Crea tu nueva cuenta' : 'Plataforma de Gestión y Catálogo'}</Text>

        {errorForm ? <Text style={styles.errorBanner}>{errorForm}</Text> : null}

        {isRegistering && (
          <>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Yoli Yma" 
              placeholderTextColor="#aaa"
              value={nombre}
              onChangeText={setNombre}
            />
          </>
        )}

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput 
          style={styles.input} 
          placeholder="correo@artesanias.com" 
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Mínimo 6 caracteres" 
            placeholderTextColor="#aaa"
            secureTextEntry={!mostrarPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)} style={styles.eyeBtn}>
            <Ionicons name={mostrarPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.mainButton} onPress={handleAction}>
          <Text style={styles.mainButtonText}>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={cambiarModo} style={styles.switchContainer}>
          <Text style={styles.switchText}>
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 25, elevation: 4 },
  logoImage: { width: 140, height: 60, alignSelf: 'center', marginBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },
  subtitle: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20 },
  errorBanner: { backgroundColor: '#ffebee', color: COLORS.error, padding: 10, borderRadius: 6, fontSize: 12, marginBottom: 15, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  input: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 14, color: COLORS.textMain },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, marginBottom: 20 },
  passwordInput: { flex: 1, padding: 12, fontSize: 14, color: COLORS.textMain },
  eyeBtn: { padding: 12 },
  mainButton: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchContainer: { marginTop: 15, alignItems: 'center' },
  switchText: { color: '#333333', fontSize: 13, fontWeight: '600' },
});