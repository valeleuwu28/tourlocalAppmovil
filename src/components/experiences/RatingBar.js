import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Componente RatingBar reutilizable para calificar con estrellas
 *
 * @param {number} value - Calificación actual (1 a 5)
 * @param {Function} onValueChange - Callback ejecutado al seleccionar una estrella
 * @param {boolean} disabled - Si las estrellas están deshabilitadas
 */
export default function RatingBar({ value = 0, onValueChange, disabled = false }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onValueChange && onValueChange(star)}
          disabled={disabled}
          activeOpacity={0.7}
          style={styles.starButton}
          accessibilityLabel={`${star} estrellas`}
        >
          <Text
            style={[
              styles.star,
              star <= value ? styles.starFilled : styles.starEmpty,
            ]}
          >
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  starButton: {
    padding: 6,
  },
  star: {
    fontSize: 34,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#CBD5E1',
  },
});
