// Configuración centralizada de la API para TourLocal Móvil
// Puedes sobrescribir con EXPO_PUBLIC_API_URL o usar la IP de tu red local
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.26.4:3000';

export default {
  API_URL,
};
