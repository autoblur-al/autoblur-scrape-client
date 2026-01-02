import { useState } from 'react';
import { useSession } from './session.jsx';

export default function LoginModal({ open }) {
  const [view, setView] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const { error, login, register } = useSession();

  const handleInput = (e, type) => {
    const { name, value } = e.target;
    if (type === 'login') {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginData);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(registerData);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="auth-container" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)', minWidth: '340px', margin: 0 }}>
        <h1>{view === 'login' ? 'Login' : 'Create Account'}</h1>
        <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={view === 'login' ? loginData.username : registerData.username}
            onChange={e => handleInput(e, view)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={view === 'login' ? loginData.password : registerData.password}
            onChange={e => handleInput(e, view)}
            required
          />
          <button type="submit">{view === 'login' ? 'Login' : 'Register'}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div style={{ marginTop: '1em' }}>
          {view === 'login' ? (
            <span>Don't have an account? <button onClick={() => setView('register')}>Create Account</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setView('login')}>Login</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
