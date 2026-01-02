import React, { useState, useRef } from 'react';
import { Card, Button, Typography, Spin } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useSession } from '../auth/session.jsx';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// Prevent horizontal scroll globally
if (typeof document !== 'undefined') {
  document.body.style.overflowX = 'hidden';
}

const API_HOST = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:8000';

export default function CarDataScreen() {
  const [carUrl, setCarUrl] = useState('');
  const [carError, setCarError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const imageIdsRef = useRef([]);
  const { user, token, logout, setCarData, setImageCache } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setCarUrl(e.target.value);
  };

  const handleCarData = async (e) => {
    e.preventDefault();
    setCarError('');
    setCarData(null);
    setImageCache({});
    setIsLoading(true);
    
    if (!carUrl) {
      setCarError('Please enter a car listing URL.');
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_HOST}/car-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: carUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setCarData({ ...data, id: String(data.car_id) });
        imageIdsRef.current = data.image_ids || [];
        setImageIdx(0);
        setImageCache({});
        if (data.image_ids && data.image_ids.length > 0) {
          fetchAndCacheImage(data.image_ids[0]);
          if (data.image_ids.length > 1) {
            fetchAndCacheImage(data.image_ids[1]);
          }
        }
        setIsLoading(false);
        navigate(`/car/${data.car_id}`);
      } else {
        const err = await res.json();
        setCarError(err.detail || 'Failed to fetch car data');
        setIsLoading(false);
      }
    } catch (err) {
      setCarError('Network error');
      setIsLoading(false);
    }
  };

  const fetchAndCacheImage = async (id) => {
    setImageCache(prev => {
      if (prev[id]) return prev;
      return prev;
    });
    try {
      const res = await fetch(`${API_HOST}/car-image/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });
      if (res.ok) {
        const blob = await res.blob();
        setImageCache(prev => ({ ...prev, [id]: URL.createObjectURL(blob) }));
      }
    } catch {}
  };

  const handleNext = () => {
    const ids = imageIdsRef.current;
    if (imageIdx < ids.length - 1) {
      const nextIdx = imageIdx + 1;
      setImageIdx(nextIdx);
      const nextImageId = ids[nextIdx + 1];
      if (nextImageId && !imageCache[nextImageId]) fetchAndCacheImage(nextImageId);
    }
  };

  const handlePrev = () => {
    if (imageIdx > 0) setImageIdx(idx => idx - 1);
  };

  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(100,108,255,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,100,150,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 15s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(100,200,255,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s ease-in-out infinite',
        transform: 'translate(-50%, -50%)'
      }} />

      {/* Main Card */}
      <Card style={{
        width: '100%',
        maxWidth: 900,
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 80px rgba(100,108,255,0.1)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '2.5rem',
        zIndex: 10
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '70px', 
            height: '70px', 
            margin: '0 auto 1.5rem', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🚗
          </div>
          <h2 style={{ 
            color: '#333',
            textAlign: 'center', 
            marginBottom: '0.5rem', 
            fontWeight: 700, 
            fontSize: '2.2em', 
            letterSpacing: '0.02em',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Car Data Lookup
          </h2>
          <p style={{ color: '#666', fontSize: '1rem', marginBottom: 0 }}>
            Enter a car listing URL to retrieve detailed information
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleCarData} style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1rem', 
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
            <input
              type="text"
              name="carUrl"
              placeholder="🔗 Paste car listing URL here..."
              value={carUrl}
              onChange={handleInput}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                background: '#fff',
                color: '#333',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.2)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                padding: '1rem 3rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(102,126,234,0.4)';
              }}
            >
              🔍 Get Car Data
            </button>
            {isLoading && (
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '3px solid rgba(102,126,234,0.2)',
                borderTop: '3px solid #667eea',
                animation: 'spin 1s linear infinite'
              }} />
            )}
          </div>
        </form>

        {carError && (
          <div style={{ 
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            background: 'rgba(255,107,107,0.1)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#d63031',
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.95rem'
          }}>
            ⚠️ {carError}
          </div>
        )}

        {/* User Info & Logout */}
        {user && (
          <div style={{ 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>Logged in as</div>
                <div style={{ fontWeight: 600, color: '#333' }}>{user.username || 'User'}</div>
              </div>
            </div>
            <button 
              onClick={() => { logout(); navigate('/'); }} 
              style={{ 
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                background: '#fff',
                color: '#666',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#ff6b6b';
                e.target.style.color = '#ff6b6b';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.color = '#666';
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </Card>

      <style>
{`
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ant-table {
  background: rgba(255,255,255,0.95) !important;
  color: #333 !important;
  border-radius: 12px !important;
  overflow: hidden;
}
.ant-table-thead > tr > th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  font-weight: 600;
  border: none !important;
}
.ant-table-tbody > tr > td {
  background: #fff !important;
  color: #333 !important;
  border-bottom: 1px solid #f0f0f0 !important;
}
.ant-table-tbody > tr:hover > td {
  background: #f9f9ff !important;
}
.custom-table-row {
  background: #fff !important;
}
`}
</style>
    </div>
  );
}
