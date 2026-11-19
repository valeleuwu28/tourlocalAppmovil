import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../config';
import { getSession } from '../../utils/storage';

/**
 * Pantalla SavedScreen / Guardados (Funcionalidad transversal asignada a Esther Daza)
 * Permite a los usuarios consultar y gestionar su lista de destinos turísticos favoritos.
 * Consume GET /api/guardados y DELETE /api/guardados/:id mediante el header X-User-Id.
 */
export default function SavedScreen({ navigation }) {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedPlaces = useCallback(async () => {
    try {
      setError(null);
      const { user } = await getSession();
      const userId = user?.id || '1';

      const res = await fetch(`${API_URL}/api/guardados`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(userId),
        },
      });

      if (!res.ok) {
        throw new Error('No se pudieron obtener los lugares guardados');
      }

      const data = await res.json();
      setSavedPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Recargar cada vez que la pantalla toma foco
  useFocusEffect(
    useCallback(() => {
      fetchSavedPlaces();
    }, [fetchSavedPlaces])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSavedPlaces();
  };

  const handleRemoveSaved = (item) => {
    Alert.alert(
      'Quitar de guardados',
      `¿Deseas eliminar "${item.nombre || item.title}" de tus guardados?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { user } = await getSession();
              const userId = user?.id || '1';

              const res = await fetch(`${API_URL}/api/guardados/${item.id}`, {
                method: 'DELETE',
                headers: {
                  'X-User-Id': String(userId),
                },
              });

              if (res.ok) {
                setSavedPlaces((prev) => prev.filter((p) => p.id !== item.id));
              } else {
                Alert.alert('Error', 'No se pudo eliminar el lugar');
              }
            } catch {
              Alert.alert('Error', 'Fallo de conexión al eliminar');
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('PlaceDetail', {
        id: item.id,
        destino: {
          id: item.id,
          title: item.nombre || item.title,
          location: item.ubicacion || item.location,
          image: item.imagen || item.image,
          rating: item.calificacion || item.rating,
          reviews: item.resenas || item.reviews,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lugares Guardados</Text>
        <Text style={styles.headerSubtitle}>
          Tus experiencias y destinos turísticos favoritos
        </Text>
      </View>

      {/* Contenido */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.loadingText}>Cargando tus guardados...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={52} color="#EF4444" />
          <Text style={styles.errorTitle}>Error al cargar guardados</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSavedPlaces}>
            <Text style={styles.retryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedPlaces}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#0F766E']}
            />
          }
          renderItem={({ item }) => {
            const title = item.nombre || item.title || 'Destino';
            const location = item.ubicacion || item.location || 'La Paz, Bolivia';
            const rating = item.calificacion || item.rating || 4.8;
            const image =
              item.imagen ||
              item.image ||
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => handleItemPress(item)}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <View style={styles.cardLocation}>
                    <Ionicons name="location-sharp" size={13} color="#0F766E" />
                    <Text style={styles.cardLocationText} numberOfLines={1}>
                      {location}
                    </Text>
                  </View>
                  <View style={styles.cardRating}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.cardRatingText}>{rating}</Text>
                  </View>
                </View>

                {/* Botón para eliminar */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveSaved(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="bookmark-outline" size={44} color="#0F766E" />
              </View>
              <Text style={styles.emptyTitle}>No tienes lugares guardados</Text>
              <Text style={styles.emptySubtitle}>
                Explora los destinos turísticos disponibles y presiona el ícono de corazón para agregarlos a tu lista.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation?.navigate?.('Explorar')}
                activeOpacity={0.85}
              >
                <Text style={styles.exploreBtnText}>Explorar destinos</Text>
                <Ionicons name="compass-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: 78,
    height: 78,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLocationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 3,
    flex: 1,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  removeBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
