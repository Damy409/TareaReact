import { createContext, useContext, useMemo, useState } from 'react';
import { request } from '../api/client.js';

const AuthContext = createContext(null);

function getTokenFromLoginResponse(data) {
  if (typeof data === 'string') {
    return data;
  }

  return data?.token || data?.accessToken || data?.jwt || data?.data?.token;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  async function login(username, password) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const nextToken = getTokenFromLoginResponse(data);

    if (!nextToken) {
      throw new Error('El servidor no devolvio un token valido.');
    }

    localStorage.setItem('token', nextToken);
    setToken(nextToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      token,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return context;
}
