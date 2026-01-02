import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [user, token]);

  const login = async (loginData) => {
    setError('');
    try {
      const res = await fetch('http://localhost:8000/login', {
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
      const res = await fetch('http://localhost:8000/register', {
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
    return fetch(url, opts);
  };

  return (
    <SessionContext.Provider value={{ user, token, error, login, register, logout, authFetch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
