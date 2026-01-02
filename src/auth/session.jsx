import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();
const API_HOST = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:8000';

export function SessionProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
  });
  const [error, setError] = useState('');
  const [carData, setCarData] = useState(null);
  const [imageCache, setImageCache] = useState({});

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [user, token]);

  const login = async (loginData) => {
    setError('');
    try {
      const res = await fetch(`${API_HOST}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
        setToken(data.token);
        return true;
      } else {
        const err = await res.json();
        setError(err.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const register = async (registerData) => {
    setError('');
    try {
      const res = await fetch(`${API_HOST}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
        setToken(data.token);
        return true;
      } else {
        const err = await res.json();
        setError(err.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Helper for authenticated requests
  const authFetch = async (url, options = {}) => {
    if (!token) throw new Error('No token');
    const opts = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
      },
    };
    return fetch(`${API_HOST}${url.startsWith('/') ? url : `/${url}`}`, opts);
  };

  return (
    <SessionContext.Provider value={{ user, token, error, login, register, logout, authFetch, carData, setCarData, imageCache, setImageCache }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export { SessionContext };
