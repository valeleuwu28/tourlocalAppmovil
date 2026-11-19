import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Componente DestinoCard (Módulo Esther Daza)
 * Tarjeta reutilizable que muestra la información resumida de un destino turístico.
 *
 * @param {object} destino - Objeto con datos del destino (id, title, location, image, rating, reviews, description, price, category)
 * @param {Function} onPress - Callback ejecutado al presionar la tarjeta
 */
export default function DestinoCard({ destino, onPress }) {
  if (!destino) return null;

  const {
    title,
    name,
    location,
    image,
    category,
    rating,
    reviews,
    description,
    price,
  } = destino;

  const displayName = title || name || 'Destino turístico';
  const displayRating = rating !== undefined ? Number(rating).toFixed(1) : '4.8';
  const displayReviews = reviews || '120';
  const displayPrice = price ? (price.startsWith('Bs') ? price : `Bs ${price}`) : 'Bs 50';

  const defaultImageUrl =
    image && image.startsWith('http')
      ? image
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: defaultImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ) : null}

        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={13} color="#F59E0B" style={styles.starIcon} />
          <Text style={styles.ratingText}>{displayRating}</Text>
          <Text style={styles.reviewsText}>({displayReviews})</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {displayName}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color="#0F766E" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location || 'La Paz, Bolivia'}
          </Text>
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>Desde</Text>
            <Text style={styles.priceValue}>{displayPrice}</Text>
          </View>

          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver detalle</Text>
            <Ionicons name="arrow-forward" size={13} color="#0F766E" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewsText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 2,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
});
