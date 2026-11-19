import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import * as RawLogin from '../screens/auth/LoginScreen';
import * as RawSignUp from '../screens/auth/SignUpScreen';

function createAuthPlaceholder(title, subtitle) {
  return function PlaceholderComponent() {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="person-circle-outline" size={56} color="#0F766E" />
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
      </View>
    );
  };
}

const LoginComponent =
  RawLogin?.default ||
  createAuthPlaceholder('Iniciar Sesión', 'Módulo de autenticación (En integración por Valentina)');

const SignUpComponent =
  RawSignUp?.default ||
  createAuthPlaceholder('Crear Cuenta', 'Módulo de registro (En integración por Valentina)');

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator: Flujo de navegación para usuarios no autenticados
 */
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginComponent} />
      <Stack.Screen name="SignUp" component={SignUpComponent} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
