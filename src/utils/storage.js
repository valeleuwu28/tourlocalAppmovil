import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@tourlocal_user";

export const saveSession = async (user) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getSession = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Error borrando sesión", e);
  }
};
