import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { SessionContext } from './session';

const { Title } = Typography;

export default function RegisterPage() {
  const { register, error } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    await register(values.username, values.password, values.email);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#23233a' }}>
      <Card style={{ width: 350, borderRadius: 18, boxShadow: '0 4px 24px rgba(100,108,255,0.18)' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#b3b3ff', marginBottom: '1em' }}>Register</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '1em' }} />}
        <Form name="register" onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter your username!' }]}> 
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" autoFocus />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}> 
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password!' }]}> 
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#23233a', border: 'none' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
