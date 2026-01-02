import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../auth/session.jsx';

const { Title } = Typography;

export default function LoginPage() {
  const { user, login, register, error } = useContext(SessionContext);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/car');
  }, [user, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    if (view === 'login') {
      await login({ username: values.username, password: values.password });
    } else {
      await register({ username: values.username, password: values.password });
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(100,108,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,100,150,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />
      
      <Card style={{ 
        width: 400, 
        borderRadius: 20, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 80px rgba(100,108,255,0.1)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        zIndex: 10,
        padding: '1.5rem'
      }}>
        {/* Logo/Brand Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            margin: '0 auto 1rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 16px rgba(102,126,234,0.4)'
          }}>
            🚗
          </div>
          <Title level={2} style={{ 
            margin: 0, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '1.8rem'
          }}>
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </Title>
          <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {view === 'login' ? 'Log in to continue to AutoBlur' : 'Sign up to get started'}
          </p>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '1.5em', borderRadius: '8px' }} />}
        
        <Form name={view} onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item 
            name="username" 
            label={<span style={{ fontWeight: 600, color: '#333' }}>Username</span>}
            rules={[{ required: true, message: 'Please enter your username!' }]}
          > 
            <Input 
              prefix={<UserOutlined style={{ color: '#667eea' }} />} 
              placeholder="Enter your username" 
              size="large" 
              autoFocus 
              style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
            />
          </Form.Item>
          <Form.Item 
            name="password" 
            label={<span style={{ fontWeight: 600, color: '#333' }}>Password</span>}
            rules={[{ required: true, message: 'Please enter your password!' }]}
          > 
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#667eea' }} />} 
              placeholder="Enter your password" 
              size="large" 
              style={{ borderRadius: '10px', border: '2px solid #e0e0e0' }}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: '1.5rem' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={loading} 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                height: '48px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              {view === 'login' ? 'Log In' : 'Create Account'}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
          {view === 'login' ? (
            <span style={{ color: '#666' }}>Don't have an account? <Button type="link" onClick={() => setView('register')} style={{ padding: 0, fontWeight: 600 }}>Create Account</Button></span>
          ) : (
            <span style={{ color: '#666' }}>Already have an account? <Button type="link" onClick={() => setView('login')} style={{ padding: 0, fontWeight: 600 }}>Log In</Button></span>
          )}
        </div>
      </Card>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .ant-input:focus, .ant-input-password:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 2px rgba(102,126,234,0.2) !important;
          }
          
          .ant-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102,126,234,0.5) !important;
          }
        `}
      </style>
    </div>
  );
}
