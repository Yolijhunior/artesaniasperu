import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../../presentation/screens/LoginScreen';
import { ListadoPedidosScreen } from '../../presentation/screens/ListadoPedidosScreen';
import { FormPedidoScreen } from '../../presentation/screens/FormPedidoScreen';
import { CatalogoApiScreen } from '../../presentation/screens/CatalogoApiScreen';
import { PerfilScreen } from '../../presentation/screens/PerfilScreen';
import { DetallePedidoScreen } from '../../presentation/screens/DetallePedidoScreen';
import { EditarPedidoScreen } from '../../presentation/screens/EditarPedidoScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ListadoPedidos" 
          component={ListadoPedidosScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="FormPedido" 
          component={FormPedidoScreen} 
          options={{ title: 'Nuevo Pedido' }} 
        />
        <Stack.Screen 
          name="CatalogoApi" 
          component={CatalogoApiScreen} 
          options={{ title: 'Catálogo Externo' }} 
        />
        <Stack.Screen 
          name="PerfilScreen" 
          component={PerfilScreen} 
          options={{ title: 'Perfil / Configuración' }} 
        />
        <Stack.Screen 
          name="DetallePedido" 
          component={DetallePedidoScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EditarPedido" 
          component={EditarPedidoScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};