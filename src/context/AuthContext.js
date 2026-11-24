import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearSession, getSession, saveSession } from '../utils/storage';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const session = await getSession();
        if (session.user) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (e) {
        console.warn('Error al cargar sesión:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredSession();
  }, []);

  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await saveSession(userData, tokenData);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
