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
    if (!carUrl) {
      setCarError('Please enter a car listing URL.');
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
        navigate(`/car/${data.car_id}`);
      } else {
        const err = await res.json();
        setCarError(err.detail || 'Failed to fetch car data');
      }
    } catch (err) {
      setCarError('Network error');
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
    <div className="auth-container" style={{ marginTop: '3em', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#18181c', overflowX: 'hidden' }}>
      <Card style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto 2em auto',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(40,40,40,0.18)',
        background: 'linear-gradient(135deg, #232323 80%, #18181c 100%)',
        padding: '1.5em 1.5em 1em 1.5em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{ color: '#e0e0e0', textAlign: 'center', marginBottom: '1.2em', fontWeight: 700, fontSize: '2em', letterSpacing: '0.03em' }}>Car Data Lookup</h2>
        <form onSubmit={handleCarData} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em', marginBottom: '1em' }}>
          <input
            type="text"
            name="carUrl"
            placeholder="Paste car listing URL here"
            value={carUrl}
            onChange={handleInput}
            style={{
              flex: '1 1 400px',
              minWidth: '320px',
              maxWidth: '500px',
              padding: '0.7em 1em',
              borderRadius: '8px',
              border: '1px solid #444446',
              fontSize: '1.1em',
              background: '#232323',
              color: '#e0e0e0',
              marginBottom: 0,
            }}
            required
          />
          <button type="submit" style={{
            padding: '0.7em 2em',
            borderRadius: '8px',
            border: 'none',
            background: '#232323',
            color: '#e0e0e0',
            fontWeight: 600,
            fontSize: '1.1em',
            boxShadow: '0 2px 8px rgba(40,40,40,0.10)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}>Get Car Data</button>
        </form>
        {carError && <p className="error" style={{ color: '#ff6b6b', marginBottom: '1em', textAlign: 'center' }}>{carError}</p>}
      </Card>
      {user && (
        <button onClick={logout} style={{ marginTop: '1em', padding: '0.7em 2em', borderRadius: '8px', border: 'none', background: '#232323', color: '#e0e0e0', fontWeight: 600, fontSize: '1.1em', boxShadow: '0 2px 8px rgba(40,40,40,0.10)', cursor: 'pointer' }}>Logout</button>
      )}
      <style>
{`
.ant-table {
  background: linear-gradient(135deg, #232323 80%, #18181c 100%) !important;
  color: #e0e0e0 !important;
}
.ant-table-thead > tr > th {
  background: #232323 !important;
  color: #e0e0e0 !important;
  font-weight: 500;
}
.ant-table-tbody > tr > td {
  background: #232323 !important;
  color: #b3b3b3 !important;
}
.custom-table-row {
  background: #232323 !important;
}
`}
</style>
    </div>
  );
}
