import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getDestinationCoordinates,
  openDirectionsInMaps,
  openInGoogleMaps,
} from '../../utils/mapUtils';

/**
 * Componente DestinationMapCard (Funcionalidad Especial: Ver lugar en el mapa)
 * Muestra la información geográfica del destino con coordenadas reales,
 * tarjeta visual con marcador y accesos directos a Google Maps y navegación GPS.
 */
export default function DestinationMapCard({ destino, style }) {
  if (!destino) return null;

  const coords = getDestinationCoordinates(destino);
  const title = destino.title || destino.name || 'Destino';
  const location = destino.location || 'La Paz, Bolivia';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="map" size={20} color="#0F766E" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Ubicación y Mapa</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="navigate-circle" size={14} color="#0F766E" />
          <Text style={styles.badgeText}>GPS Activo</Text>
        </View>
      </View>

      {/* Tarjeta de previsualización de mapa con diseño topográfico */}
      <View style={styles.mapCanvas}>
        {/* Fondo con cuadrícula simulando calles y relieve */}
        <View style={styles.gridOverlay}>
          <View style={styles.streetLineHorizontal} />
          <View style={styles.streetLineDiagonal} />
          <View style={styles.streetLineVertical} />
          <View style={styles.riverCurve} />
        </View>

        {/* Marcador del destino */}
        <View style={styles.pinWrapper}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinText} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <View style={styles.pinMarker}>
            <Ionicons name="location" size={32} color="#EF4444" />
          </View>
          <View style={styles.pinShadow} />
        </View>

        {/* Indicador de coordenadas en la esquina */}
        <View style={styles.coordsOverlay}>
          <Text style={styles.coordsText}>
            Lat: {coords.latitude.toFixed(4)}° | Lng: {coords.longitude.toFixed(4)}°
          </Text>
        </View>
      </View>

      {/* Detalle de la dirección y zona */}
      <View style={styles.infoRow}>
        <Ionicons name="location-sharp" size={18} color="#64748B" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.locationTitle}>{location}</Text>
          <Text style={styles.zoneSubtitle}>Zona: {coords.zone}</Text>
        </View>
      </View>

      {/* Botones de acción para abrir mapas */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openInGoogleMaps(destino)}
          activeOpacity={0.85}
        >
          <Ionicons name="map-outline" size={17} color="#0F766E" style={{ marginRight: 6 }} />
          <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => openDirectionsInMaps(destino)}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.directionsButtonText}>Cómo llegar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F766E',
    marginLeft: 4,
  },
  mapCanvas: {
    height: 140,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  streetLineHorizontal: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#FFFFFF',
    opacity: 0.8,
  },
  streetLineDiagonal: {
    position: 'absolute',
    top: -20,
    left: 40,
    width: 14,
    height: 200,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    opacity: 0.7,
  },
  streetLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 70,
    width: 10,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  riverCurve: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: '#38BDF8',
    opacity: 0.35,
    borderRadius: 20,
  },
  pinWrapper: {
    alignItems: 'center',
    zIndex: 10,
  },
  pinBubble: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: -4,
    maxWidth: 160,
  },
  pinText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  pinMarker: {
    marginTop: -2,
  },
  pinShadow: {
    width: 14,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 4,
    marginTop: -4,
  },
  coordsOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  coordsText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  zoneSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0F766E',
  },
  mapButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F766E',
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  directionsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
