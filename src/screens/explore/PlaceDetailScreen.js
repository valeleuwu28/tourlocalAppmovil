import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config';
import { getSession } from '../../utils/storage';
import useApi from '../../hooks/useApi';

/**
 * Pantalla PlaceDetailScreen (Módulo Esther Daza)
 * Muestra el detalle completo de un destino turístico consumiendo GET /api/destinos/:id.
 * Permite guardar en favoritos y navegar hacia el agendamiento de fecha y horario (Módulo Naomi).
 */
export default function PlaceDetailScreen({ route, navigation }) {
  const initialDestino = route?.params?.destino || null;
  const destinoId = route?.params?.id || initialDestino?.id;

  // Consultar información actualizada desde la API
  const { data: apiDestino, loading, error, refetch } = useApi(
    destinoId ? `/api/destinos/${destinoId}` : null
  );

  const destino = apiDestino || initialDestino;

  // Estado para la funcionalidad de Guardados / Favoritos
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  // Verificar si el lugar ya está guardado en el backend
  useEffect(() => {
    let isMounted = true;
    const checkSavedStatus = async () => {
      if (!destinoId) return;
      try {
        const { user } = await getSession();
        const userId = user?.id || '1';

        const res = await fetch(`${API_URL}/api/guardados/${destinoId}`, {
          headers: { 'X-User-Id': String(userId) },
        });
        if (isMounted && res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setIsSaved(true);
          }
        }
      } catch {
        // En caso de fallo silencioso mantener estado default
      }
    };

    checkSavedStatus();
    return () => {
      isMounted = false;
    };
  }, [destinoId]);

  // Alternar guardado (POST o DELETE a /api/guardados)
  const toggleSavePlace = async () => {
    if (!destinoId) return;
    setSavingLoading(true);
    try {
      const { user } = await getSession();
      const userId = user?.id || '1';

      if (isSaved) {
        const res = await fetch(`${API_URL}/api/guardados/${destinoId}`, {
          method: 'DELETE',
          headers: { 'X-User-Id': String(userId) },
        });
        if (res.ok) {
          setIsSaved(false);
          Alert.alert('Guardados', 'Eliminado de tus lugares guardados');
        }
      } else {
        const res = await fetch(`${API_URL}/api/guardados`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': String(userId),
          },
          body: JSON.stringify({ id: destinoId }),
        });
        if (res.ok) {
          setIsSaved(true);
          Alert.alert('Guardados', '¡Destino guardado en tus favoritos!');
        }
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado de guardado');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleAgendar = () => {
    if (!destino) return;
    // Contrato con el módulo de Naomi (ScheduleScreen)
    if (navigation && navigation.navigate) {
      navigation.navigate('Schedule', {
        destinoId: destino.id,
        destino,
      });
    }
  };

  if (loading && !destino) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loadingText}>Cargando información del destino...</Text>
      </SafeAreaView>
    );
  }

  if (error && !destino) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
        <Text style={styles.errorTitle}>Error al cargar el destino</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={refetch}>
          <Text style={styles.primaryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayName = destino?.title || destino?.name || 'Detalle del destino';
  const displayRating = destino?.rating ? Number(destino.rating).toFixed(1) : '4.8';
  const displayReviews = destino?.reviews || '120';
  const displayPrice = destino?.price
    ? destino.price.startsWith('Bs')
      ? destino.price
      : `Bs ${destino.price}`
    : 'Bs 50';

  const defaultImageUrl =
    destino?.image && destino.image.startsWith('http')
      ? destino.image
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';

  const guide = destino?.guide;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Imagen Principal Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: defaultImageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Barra superior de botones flotantes */}
          <SafeAreaView style={styles.floatingNav}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation?.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={toggleSavePlace}
              activeOpacity={0.8}
              disabled={savingLoading}
            >
              {savingLoading ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Ionicons
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isSaved ? '#EF4444' : '#0F172A'}
                />
              )}
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Contenido descriptivo */}
        <View style={styles.sheetContent}>
          {/* Categoría y Calificación */}
          <View style={styles.badgesRow}>
            {destino?.category ? (
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{destino.category}</Text>
              </View>
            ) : null}

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={styles.ratingNumber}>{displayRating}</Text>
              <Text style={styles.reviewsNumber}>({displayReviews} reseñas)</Text>
            </View>
          </View>

          {/* Nombre y Ubicación */}
          <Text style={styles.destinationTitle}>{displayName}</Text>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#0F766E" />
            <Text style={styles.locationText}>
              {destino?.location || 'La Paz, Bolivia'}
            </Text>
          </View>

          {/* Características rápidas */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="time-outline" size={20} color="#0F766E" />
              <Text style={styles.featureTitle}>Duración</Text>
              <Text style={styles.featureValue}>
                {destino?.duration || '3 - 4 horas'}
              </Text>
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featureItem}>
              <Ionicons name="wallet-outline" size={20} color="#0F766E" />
              <Text style={styles.featureTitle}>Precio</Text>
              <Text style={styles.featureValue}>{displayPrice}</Text>
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0F766E" />
              <Text style={styles.featureTitle}>Seguridad</Text>
              <Text style={styles.featureValue}>Guía oficial</Text>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Acerca de este lugar</Text>
            <Text style={styles.descriptionText}>
              {destino?.description ||
                'Descubre este increíble destino turístico ubicado en el corazón andino. Disfruta de paisajes inolvidables, riqueza histórica y cultura viva junto a guías expertos.'}
            </Text>
          </View>

          {/* Información del Guía Turístico asignado */}
          {guide ? (
            <View style={styles.guideCard}>
              <View style={styles.guideHeader}>
                <Ionicons name="person-circle" size={44} color="#0F766E" />
                <View style={styles.guideInfo}>
                  <Text style={styles.guideName}>
                    {guide.name || 'Guía Turístico Certificado'}
                  </Text>
                  <Text style={styles.guideRole}>Guía oficial TourLocal</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.verifiedText}>Verificado</Text>
                </View>
              </View>
              {guide.phone ? (
                <View style={styles.guideContact}>
                  <Ionicons name="call-outline" size={14} color="#64748B" />
                  <Text style={styles.guideContactText}>{guide.phone}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Barra Inferior Sticky con Botón "Agendar experiencia" */}
      <SafeAreaView style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={styles.bottomPriceLabel}>Precio por persona</Text>
            <Text style={styles.bottomPriceValue}>{displayPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleAgendar}
            activeOpacity={0.88}
          >
            <Text style={styles.bookButtonText}>Agendar experiencia</Text>
            <Ionicons name="calendar" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  floatingNav: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  sheetContent: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryPillText: {
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 4,
  },
  reviewsNumber: {
    fontSize: 12,
    color: '#B45309',
    marginLeft: 2,
  },
  destinationTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  featureTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  featureValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 2,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  guideCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideInfo: {
    marginLeft: 12,
    flex: 1,
  },
  guideName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  guideRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  verifiedText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
  },
  guideContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  guideContactText: {
    fontSize: 12,
    color: '#64748B',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F766E',
  },
  bookButton: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 24,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
