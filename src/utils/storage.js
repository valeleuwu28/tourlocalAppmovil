import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@tourlocal_user';
const TOKEN_KEY = '@tourlocal_token';

/**
 * Guarda los datos del usuario y el token de autenticación en AsyncStorage
 */
export const saveSession = async (user, token) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error al guardar sesión en AsyncStorage:', error);
  }
};

/**
 * Recupera la sesión actual del usuario desde AsyncStorage
 */
export const getSession = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
      user: user ? JSON.parse(user) : null,
      token,
    };
  } catch (error) {
    console.error('Error al obtener sesión desde AsyncStorage:', error);
    return { user: null, token: null };
  }
};

/**
 * Elimina la sesión actual (cierre de sesión)
 */
export const clearSession = async () => {
  try {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
  } catch (error) {
    console.error('Error al limpiar sesión en AsyncStorage:', error);
  }
};

export default {
  saveSession,
  getSession,
  clearSession,
};
