import { Platform } from 'react-native';

// Tu IP local Wi-Fi para probar en celular físico con Expo Go
const LOCAL_IP = '192.168.0.37';

// Si pruebas en navegador web usa localhost; en celular usa tu IP de Wi-Fi
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web'
    ? 'http://localhost:3000'
    : `http://${LOCAL_IP}:3000`);

export default {
  API_URL,
};
