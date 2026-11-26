import React, { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Callout } from 'react-native-maps';
import {
  getDestinationCoordinates,
  openDirectionsInMaps,
  openInGoogleMaps,
} from '../../utils/mapUtils';

/**
 * Componente DestinationMapCard (Funcionalidad Especial: Mapa con Librería react-native-maps)
 * Integra un mapa interactivo nativo con zoom, cambio de vista satelital/estándar,
 * marcador personalizado en coordenadas reales y botones de navegación.
 */
export default function DestinationMapCard({ destino, style }) {
  if (!destino) return null;

  const mapRef = useRef(null);
  const [mapType, setMapType] = useState('standard'); // 'standard' o 'hybrid'

  const coords = getDestinationCoordinates(destino);
  const title = destino.title || destino.name || 'Destino TourLocal';
  const location = destino.location || 'La Paz, Bolivia';

  const initialRegion = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 500);
    }
  };

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  return (
    <View style={[styles.container, style]}>
      {/* Encabezado con información de la librería */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Ionicons name="map" size={20} color="#0F766E" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Ubicación y Mapa</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="library" size={13} color="#0F766E" />
          <Text style={styles.badgeText}>react-native-maps</Text>
        </View>
      </View>

      {/* Contenedor del Mapa Interactivo con react-native-maps */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          // Vista para navegador web (OpenStreetMap interactivo)
          <iframe
            title="Mapa del Destino"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              coords.longitude - 0.01
            }%2C${coords.latitude - 0.01}%2C${coords.longitude + 0.01}%2C${
              coords.latitude + 0.01
            }&layer=mapnik&marker=${coords.latitude}%2C${coords.longitude}`}
          />
        ) : (
          // Mapa nativo para Android / iOS con react-native-maps
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            mapType={mapType}
            showsUserLocation={true}
            showsCompass={true}
            showsScale={true}
            toolbarEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              title={title}
              description={location}
              pinColor="#0F766E"
            >
              <Callout tooltip>
                <View style={styles.customCallout}>
                  <Text style={styles.calloutTitle}>{title}</Text>
                  <Text style={styles.calloutSubtitle}>{location}</Text>
                  <Text style={styles.calloutCoords}>
                    {coords.latitude.toFixed(4)}°, {coords.longitude.toFixed(4)}°
                  </Text>
                </View>
              </Callout>
            </Marker>
          </MapView>
        )}

        {/* Controles flotantes sobre el mapa */}
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={toggleMapType}
            activeOpacity={0.8}
          >
            <Ionicons
              name={mapType === 'standard' ? 'earth' : 'map'}
              size={18}
              color="#0F766E"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleRecenter}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={18} color="#0F766E" />
          </TouchableOpacity>
        </View>

        {/* Coordenadas en la barra inferior del mapa */}
        <View style={styles.coordsOverlay}>
          <Text style={styles.coordsText}>
            GPS: {coords.latitude.toFixed(4)}°, {coords.longitude.toFixed(4)}°
          </Text>
        </View>
      </View>

      {/* Información de ubicación y zona */}
      <View style={styles.infoRow}>
        <Ionicons name="location-sharp" size={18} color="#64748B" style={styles.infoIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.locationTitle}>{location}</Text>
          <Text style={styles.zoneSubtitle}>Zona: {coords.zone}</Text>
        </View>
      </View>

      {/* Botones de acción complementarios */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openInGoogleMaps(destino)}
          activeOpacity={0.85}
        >
          <Ionicons name="open-outline" size={16} color="#0F766E" style={{ marginRight: 6 }} />
          <Text style={styles.mapButtonText}>Abrir en Maps</Text>
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
    fontWeight: '700',
    color: '#0F766E',
    marginLeft: 4,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#E2E8F0',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 8,
    zIndex: 10,
  },
  controlBtn: {
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  customCallout: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    maxWidth: 200,
    alignItems: 'center',
  },
  calloutTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  calloutSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  calloutCoords: {
    color: '#38BDF8',
    fontSize: 9,
    marginTop: 4,
  },
  coordsOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  coordsText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
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
