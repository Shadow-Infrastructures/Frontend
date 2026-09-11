import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredToken, getStoredUser } from '@/api/client';
import { loginRequest, registerRequest } from '@/api/auth';

/**
 * Auth context — provides the current user, loading state, and
 * login / register / logout actions to the rest of the app.
 */
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ loading: true, user: null });

  // Restore session from sessionStorage on initial mount.
  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();
    setAuth({ loading: false, user: token ? user : null });
  }, []);

  /** POST /auth/login — store token + user, update context. */
  async function login(email, password) {
    const data = await loginRequest(email, password);
    const token = data?.access_token;
    const user = data?.user || { email };
    
    if (!token) throw new Error('Login failed: no access token returned');
    
    sessionStorage.setItem('treehouse_access_token', token);
    sessionStorage.setItem('treehouse_user', JSON.stringify(user));
    
    setAuth({ loading: false, user });
    return user;
  }

  /** POST /auth/register — store token + user if returned, update context. */
  async function register(payload) {
    const data = await registerRequest(payload);
    const token = data?.access_token;
    const user = data?.user || { email: payload.email, full_name: payload.full_name };
    if (token) {
      sessionStorage.setItem('treehouse_access_token', token);
      sessionStorage.setItem('treehouse_user', JSON.stringify(user));
    }
    console.log(payload);
    setAuth({ loading: false, user });
    return user;
  }

  /** Clear session and context. */
  function logout() {
    sessionStorage.removeItem('treehouse_access_token');
    sessionStorage.removeItem('treehouse_user');
    setAuth({ loading: false, user: null });
  }

  const value = { ...auth, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
