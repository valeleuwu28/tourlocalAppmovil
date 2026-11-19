import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ExploreScreen from '../screens/explore/ExploreScreen';
import SavedScreen from '../screens/explore/SavedScreen';
import * as RawHistory from '../screens/reservations/HistoryScreen';
import * as RawProfile from '../screens/profile/ProfileScreen';

// Fallback funcional en caso de que los módulos de las compañeras aún no estén implementados
const HistoryComponent =
  RawHistory?.default ||
  function HistoryPlaceholder() {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="time-outline" size={56} color="#0F766E" />
        <Text style={styles.placeholderTitle}>Historial de Reservas</Text>
        <Text style={styles.placeholderSubtitle}>
          Módulo de reservas y transacciones (En integración por Andrea)
        </Text>
      </View>
    );
  };

const ProfileComponent =
  RawProfile?.default ||
  function ProfilePlaceholder() {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="person-outline" size={56} color="#0F766E" />
        <Text style={styles.placeholderTitle}>Perfil de Usuario</Text>
        <Text style={styles.placeholderSubtitle}>
          Módulo de autenticación y perfil (En integración por Valentina)
        </Text>
      </View>
    );
  };

const Tab = createBottomTabNavigator();

/**
 * TabNavigator principal de TourLocal Móvil
 * Integra las 4 secciones principales: Explorar, Guardados, Historial y Perfil.
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0F766E',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Explorar') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Guardados') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Guardados" component={SavedScreen} />
      <Tab.Screen name="Historial" component={HistoryComponent} />
      <Tab.Screen name="Perfil" component={ProfileComponent} />
    </Tab.Navigator>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
  },
  placeholderSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
});
