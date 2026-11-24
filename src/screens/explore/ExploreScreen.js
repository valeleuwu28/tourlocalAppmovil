import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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
import { getCurrentIp, setCustomIp, resetToDefaultIp, DEFAULT_LOCAL_IP } from '../../config';

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
  const [showIpModal, setShowIpModal] = useState(false);
  const [tempIp, setTempIp] = useState(getCurrentIp());

  const handleSaveIp = async () => {
    if (!tempIp.trim()) {
      Alert.alert('IP requerida', 'Por favor ingresa la IP de tu laptop.');
      return;
    }
    await setCustomIp(tempIp.trim());
    setShowIpModal(false);
    refetch();
  };

  const handleResetIp = async () => {
    await resetToDefaultIp();
    setTempIp(DEFAULT_LOCAL_IP);
    setShowIpModal(false);
    refetch();
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              setTempIp(getCurrentIp());
              setShowIpModal(true);
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerAvatar}
            onPress={() => router.navigate('/(tabs)/profile')}
          >
            <Ionicons name="person-circle-outline" size={36} color="#0F766E" />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity
            style={styles.changeIpBtnSecondary}
            onPress={() => {
              setTempIp(getCurrentIp());
              setShowIpModal(true);
            }}
          >
            <Ionicons name="settings-outline" size={16} color="#0F766E" style={{ marginRight: 6 }} />
            <Text style={styles.changeIpBtnSecondaryText}>
              Cambiar IP ({getCurrentIp()})
            </Text>
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

      {/* Modal interactivo para configurar la IP de la laptop */}
      <Modal
        visible={showIpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="hardware-chip-outline" size={24} color="#0F766E" />
              <Text style={styles.modalTitle}>Configurar IP del Servidor</Text>
            </View>
            <Text style={styles.modalDesc}>
              Escribe la dirección IPv4 de tu laptop según &apos;ipconfig&apos; (ej. 172.18.28.183 o la que te dé tu Wi-Fi / Hotspot):
            </Text>

            <TextInput
              style={styles.modalInput}
              value={tempIp}
              onChangeText={setTempIp}
              placeholder="Ej: 172.18.28.183"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveIpBtn}
                onPress={handleSaveIp}
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.saveIpBtnText}>Guardar y Conectar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetIpBtn}
                onPress={handleResetIp}
              >
                <Text style={styles.resetIpBtnText}>Restablecer predeterminada</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelIpBtn}
                onPress={() => setShowIpModal(false)}
              >
                <Text style={styles.cancelIpBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerIconBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  changeIpBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0F766E',
  },
  changeIpBtnSecondaryText: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalButtons: {
    gap: 8,
  },
  saveIpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveIpBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resetIpBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetIpBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelIpBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelIpBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
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
