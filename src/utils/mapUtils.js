import { Linking, Platform } from 'react-native';

/**
 * Coordenadas geográficas oficiales de los principales destinos turísticos de TourLocal (La Paz y alrededores)
 */
export const DESTINATION_COORDINATES = {
  1: { latitude: -16.4955, longitude: -68.1258, zone: 'Mirador Killi Killi, Centro' }, // Letrero LA PAZ
  2: { latitude: -16.5547, longitude: -68.6736, zone: 'Ingavi, Altiplano' },          // Tiwanaku
  3: { latitude: -16.5683, longitude: -68.0944, zone: 'Mallasa, Zona Sur' },         // Valle de la Luna
  4: { latitude: -16.2625, longitude: -68.1539, zone: 'Cordillera Real' },            // Huayna Potosí
  5: { latitude: -16.5028, longitude: -68.1633, zone: 'La Ceja, El Alto' },           // Cholitas Luchadoras
  6: { latitude: -14.4833, longitude: -68.5833, zone: 'Norte de La Paz' },            // Madidi
  7: { latitude: -16.3500, longitude: -68.1333, zone: 'Cordillera Real' },            // Chacaltaya
  8: { latitude: -20.1338, longitude: -67.4891, zone: 'Potosí, Bolivia' },            // Salar de Uyuni
  9: { latitude: -16.0239, longitude: -69.1764, zone: 'Lago Titicaca' },              // Isla del Sol
  10: { latitude: -16.3333, longitude: -67.9167, zone: 'Yungas, La Paz' },           // Camino de la Muerte
};

/**
 * Obtiene las coordenadas de un destino por ID o por búsqueda de nombre
 */
export function getDestinationCoordinates(destino) {
  if (!destino) return { latitude: -16.5000, longitude: -68.1500, zone: 'La Paz, Bolivia' };

  if (destino.id && DESTINATION_COORDINATES[destino.id]) {
    return DESTINATION_COORDINATES[destino.id];
  }

  const name = (destino.title || destino.name || '').toLowerCase();
  if (name.includes('letrero') || name.includes('killi')) return DESTINATION_COORDINATES[1];
  if (name.includes('tiwanaku')) return DESTINATION_COORDINATES[2];
  if (name.includes('luna')) return DESTINATION_COORDINATES[3];
  if (name.includes('huayna') || name.includes('potosí') || name.includes('potosi')) return DESTINATION_COORDINATES[4];
  if (name.includes('cholita') || name.includes('lucha')) return DESTINATION_COORDINATES[5];
  if (name.includes('madidi')) return DESTINATION_COORDINATES[6];
  if (name.includes('chacaltaya')) return DESTINATION_COORDINATES[7];
  if (name.includes('uyuni') || name.includes('salar')) return DESTINATION_COORDINATES[8];
  if (name.includes('titicaca') || name.includes('sol')) return DESTINATION_COORDINATES[9];
  if (name.includes('muerte') || name.includes('yungas')) return DESTINATION_COORDINATES[10];

  return {
    latitude: destino.latitude || -16.5000,
    longitude: destino.longitude || -68.1500,
    zone: destino.location || 'La Paz, Bolivia',
  };
}

/**
 * Abre la ubicación exacta del destino en la aplicación nativa de mapas (Google Maps / Apple Maps)
 */
export async function openInGoogleMaps(destino) {
  const coords = getDestinationCoordinates(destino);
  const title = destino?.title || destino?.name || 'Destino TourLocal';
  const label = encodeURIComponent(`${title} (${destino?.location || 'La Paz, Bolivia'})`);

  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${coords.latitude},${coords.longitude}`,
    android: `geo:${coords.latitude},${coords.longitude}?q=${coords.latitude},${coords.longitude}(${label})`,
    default: `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`,
  });

  const webFallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${title} ${destino?.location || 'La Paz Bolivia'}`
  )}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(webFallback);
    }
  } catch {
    await Linking.openURL(webFallback);
  }
}

/**
 * Inicia la navegación GPS paso a paso ("Cómo llegar") hacia el destino
 */
export async function openDirectionsInMaps(destino) {
  const coords = getDestinationCoordinates(destino);
  const title = destino?.title || destino?.name || 'Destino TourLocal';

  const url = Platform.select({
    ios: `maps:0,0?daddr=${coords.latitude},${coords.longitude}`,
    android: `google.navigation:q=${coords.latitude},${coords.longitude}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`,
  });

  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(webFallback);
    }
  } catch {
    await Linking.openURL(webFallback);
  }
}
