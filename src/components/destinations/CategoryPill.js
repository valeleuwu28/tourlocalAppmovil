import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/**
 * Componente CategoryPill (Módulo Esther Daza)
 * Botón tipo píldora para el filtrado de categorías de destinos.
 *
 * @param {string} label - Texto de la categoría (ej: "Todos", "Parques", etc.)
 * @param {boolean} selected - Indica si la categoría está activa
 * @param {Function} onPress - Función que se ejecuta al seleccionar
 */
export default function CategoryPill({ label, selected = false, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.pill,
        selected ? styles.pillSelected : styles.pillUnselected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          selected ? styles.textSelected : styles.textUnselected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  pillSelected: {
    backgroundColor: '#0F766E', // Verde esmeralda moderno TourLocal
    borderColor: '#0F766E',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textUnselected: {
    color: '#64748B',
  },
  textSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
