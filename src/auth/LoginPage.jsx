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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#23233a' }}>
      <Card style={{ width: 350, borderRadius: 18, boxShadow: '0 4px 24px rgba(100,108,255,0.18)' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#b3b3ff', marginBottom: '1em' }}>{view === 'login' ? 'Login' : 'Create Account'}</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '1em' }} />}
        <Form name={view} onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username!' }]}> 
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password!' }]}> 
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#23233a', border: 'none' }}>
              {view === 'login' ? 'Log In' : 'Register'}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '1em', textAlign: 'center' }}>
          {view === 'login' ? (
            <span>Don't have an account? <Button type="link" onClick={() => setView('register')} style={{ padding: 0 }}>Create Account</Button></span>
          ) : (
            <span>Already have an account? <Button type="link" onClick={() => setView('login')} style={{ padding: 0 }}>Login</Button></span>
          )}
        </div>
      </Card>
    </div>
  );
}
