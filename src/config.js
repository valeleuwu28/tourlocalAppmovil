import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IP local predeterminada cuando compartes señal desde el celular (Hotspot)
export const DEFAULT_LOCAL_IP = '172.18.28.183';
const PREVIOUS_DEFAULT_LOCAL_IP = '10.191.47.44';

let activeIp = DEFAULT_LOCAL_IP;

// Cargar IP personalizada persistente al iniciar
const ipInitialization = AsyncStorage.getItem('CUSTOM_SERVER_IP')
  .then((stored) => {
    if (stored && stored.trim()) {
      const savedIp = stored.trim();
      activeIp =
        savedIp === PREVIOUS_DEFAULT_LOCAL_IP
          ? DEFAULT_LOCAL_IP
          : savedIp;
    }
  })
  .catch((error) => {
    console.warn('No se pudo cargar la IP del servidor guardada:', error);
  });

/**
 * Obtiene la IP actual configurada
 */
export function getCurrentIp() {
  return activeIp;
}

/**
 * Guarda una nueva IP en memoria y en almacenamiento persistente
 */
export async function setCustomIp(newIp) {
  if (!newIp) return;
  const clean = newIp.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/:3000$/, '');
  activeIp = clean;
  try {
    await AsyncStorage.setItem('CUSTOM_SERVER_IP', clean);
  } catch {}
}

/**
 * Restablece la IP a la predeterminada
 */
export async function resetToDefaultIp() {
  activeIp = DEFAULT_LOCAL_IP;
  try {
    await AsyncStorage.removeItem('CUSTOM_SERVER_IP');
  } catch {}
}

/**
 * Resuelve la URL base de la API según la plataforma y la IP activa
 */
export function getApiBaseUrl() {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  return `http://${activeIp}:3000`;
}

export async function getApiBaseUrlAsync() {
  await ipInitialization;
  return getApiBaseUrl();
}

export const API_URL = getApiBaseUrl();

export default {
  DEFAULT_LOCAL_IP,
  getCurrentIp,
  setCustomIp,
  resetToDefaultIp,
  getApiBaseUrl,
  getApiBaseUrlAsync,
  API_URL,
};
