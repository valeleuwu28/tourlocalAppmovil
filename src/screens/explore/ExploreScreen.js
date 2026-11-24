import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useApi from '../../hooks/useApi';
import CategoryPill from '../../components/destinations/CategoryPill';
import DestinoCard from '../../components/destinations/DestinoCard';

const CATEGORIES = [
  'Todos',
  'Populares',
  'Históricos',
  'Parques',
  'Senderismo',
  'Museos',
  'Naturaleza',
];

/**
 * Pantalla Principal ExploreScreen (Módulo Esther Daza)
 * Muestra el catálogo de destinos turísticos obtenidos en tiempo real de la API REST / SQLite.
 * Incluye encabezado, buscador en vivo, filtros por categorías, estados de carga y error.
 */
export default function ExploreScreen({ navigation }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Endpoint reactivo según la categoría seleccionada
  const endpoint = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'Todos') {
      return '/api/destinos';
    }
    return `/api/destinos?categoria=${encodeURIComponent(selectedCategory)}`;
  }, [selectedCategory]);

  const { data: destinos, loading, error, refetch } = useApi(endpoint);

  // Manejo de Pull to Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Filtrado reactivo por texto de búsqueda
  const filteredDestinos = useMemo(() => {
    if (!Array.isArray(destinos)) return [];
    if (!searchQuery.trim()) return destinos;

    const query = searchQuery.toLowerCase().trim();
    return destinos.filter((d) => {
      const title = (d.title || d.name || '').toLowerCase();
      const loc = (d.location || '').toLowerCase();
      const desc = (d.description || '').toLowerCase();
      const cat = (d.category || '').toLowerCase();
      return (
        title.includes(query) ||
        loc.includes(query) ||
        desc.includes(query) ||
        cat.includes(query)
      );
    });
  }, [destinos, searchQuery]);

  const handleCardPress = (destino) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('PlaceDetail', {
        id: String(destino.id),
        destino: JSON.stringify(destino),
      });
    } else {
      router.push({
        pathname: '/place-detail',
        params: {
          id: String(destino.id),
          destino: JSON.stringify(destino),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Encabezado de Bienvenida */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>¡Bienvenida de nuevo! 👋</Text>
          <Text style={styles.title}>Explora nuevos lugares</Text>
        </View>
        <TouchableOpacity
          style={styles.headerAvatar}
          onPress={() => router.navigate('/(tabs)/profile')}
        >
          <Ionicons name="person-circle-outline" size={36} color="#0F766E" />
        </TouchableOpacity>
      </View>

      {/* 2. Buscador de Destinos */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar destinos, lugares, naturaleza..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Categorías de Destinos */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 4. Contenido Principal: Carga / Error / Lista / Sin Resultados */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.loadingText}>Cargando destinos turísticos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="cloud-offline-outline" size={56} color="#EF4444" />
          <Text style={styles.errorTitle}>Error al conectar con la API</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Ionicons name="reload" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredDestinos}
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
          renderItem={({ item }) => (
            <DestinoCard
              destino={item}
              onPress={() => handleCardPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No se encontraron destinos</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No hay resultados para "${searchQuery}". Intenta con otra palabra.`
                  : 'No hay destinos disponibles en esta categoría actualmente.'}
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerAvatar: {
    padding: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  errorDescription: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
