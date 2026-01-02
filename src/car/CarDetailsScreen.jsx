import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Spin } from 'antd';
import { useSession } from '../auth/session.jsx';

const { Title } = Typography;

export default function CarDetailsScreen() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { carData, imageCache, setCarData, setImageCache } = useSession();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingImg, setLoadingImg] = useState(false);

  // Helper to fetch and cache image if not present
  const fetchAndCacheImage = async (imgId) => {
    if (imageCache[imgId]) return;
    setLoadingImg(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST || 'http://localhost:8000'}/car-image/${imgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${carData?.token || ''}`,
          'accept': 'application/json',
        },
      });
      if (res.ok) {
        const blob = await res.blob();
        setImageCache(prev => ({ ...prev, [imgId]: URL.createObjectURL(blob) }));
      }
    } finally {
      setLoadingImg(false);
    }
  };

  // Prefetch first two images when modal opens
  // Prefetch first two images on mount and when currentIdx changes
  React.useEffect(() => {
    const ids = carData.image_ids;
    if (ids && ids.length > 0) {
      fetchAndCacheImage(ids[currentIdx]);
      if (ids[currentIdx + 1]) fetchAndCacheImage(ids[currentIdx + 1]);
    }
  }, [currentIdx, carData.image_ids]);

  // Prefetch next image when navigating
  const handleNext = () => {
    const ids = carData.image_ids;
    if (currentIdx < ids.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };
  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

    // Show loading spinner if carData is not ready or does not match carId
    if (!carData || String(carData.id) !== String(carId)) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#18181c' }}>
          <Card style={{ padding: '2em', borderRadius: 16, background: '#232323', boxShadow: '0 4px 24px rgba(40,40,40,0.18)' }}>
            <Typography.Title level={3} style={{ color: '#e0e0e0' }}>Loading car details...</Typography.Title>
          </Card>
        </div>
      );
    }

  const handleSearchAnother = () => {
    // Revoke all cached image URLs to free memory
    Object.values(imageCache).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    setCarData(null);
    setImageCache({});
    navigate('/car');
  };

    return (
      <div style={{ marginTop: '3em', width: '100vw', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#18181c' }}>
        <Card style={{ maxWidth: 900, width: '100%', borderRadius: 20, boxShadow: '0 8px 32px rgba(40,40,40,0.25)', background: 'linear-gradient(135deg, #232323 80%, #18181c 100%)', padding: '2.5em 2em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2em' }}>
          <Title level={2} style={{ color: '#e0e0e0', textAlign: 'center', marginBottom: '1.2em', fontWeight: 700, letterSpacing: '0.03em' }}>{carData.car.Car_Name || 'Car Details'}</Title>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '3em', marginBottom: '2em' }}>
            {/* Car details */}
            <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.7em' }}>
                <tbody>
                  {Object.entries(carData.car).map(([key, value]) => (
                    key !== 'Car_Name' && (
                      <tr key={key}>
                        <td style={{ color: '#b3b3b3', fontWeight: 500, padding: '0.4em 1.2em 0.4em 0', textAlign: 'right', minWidth: 120, fontSize: '1.08em' }}>{key.replace(/_/g, ' ')}:</td>
                        <td style={{ color: '#e0e0e0', padding: '0.4em 0', fontSize: '1.08em', fontWeight: 400 }}>{value}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
              <Button onClick={handleSearchAnother} style={{ marginTop: '2em', background: '#232323', color: '#e0e0e0', borderRadius: 10, border: '1px solid #444', fontWeight: 500, fontSize: '1.08em', padding: '0.7em 2em', boxShadow: '0 2px 8px rgba(40,40,40,0.10)', transition: 'background 0.2s, color 0.2s' }}>Search for another car</Button>
            </div>
            {/* Single Image Gallery */}
            <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Title level={4} style={{ color: '#e0e0e0', marginBottom: '1em', textAlign: 'center', width: '100%', fontWeight: 600 }}>Photos</Title>
              {carData.image_ids && carData.image_ids.length > 0 ? (
                <div style={{ width: '100%', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1em', margin: '0 auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Button disabled={currentIdx === 0} onClick={handlePrev} style={{ borderRadius: '50%', width: 36, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3em', background: '#232323', color: '#e0e0e0', border: '1px solid #444', boxShadow: '0 2px 8px rgba(40,40,40,0.10)', transition: 'background 0.2s, color 0.2s' }}>&lt;</Button>
                    <div style={{ width: '320px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#232323', borderRadius: '12px', boxShadow: '0 4px 16px rgba(40,40,40,0.18)', border: '1px solid #444', overflow: 'hidden' }}>
                      {loadingImg || !imageCache[carData.image_ids[currentIdx]] ? (
                        <Spin size="large" />
                      ) : (
                        <img src={imageCache[carData.image_ids[currentIdx]]} alt={`Car photo ${currentIdx + 1}`} style={{ maxWidth: '320px', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px rgba(40,40,40,0.20)' }} />
                      )}
                    </div>
                    <Button disabled={currentIdx === carData.image_ids.length - 1} onClick={handleNext} style={{ borderRadius: '50%', width: 36, height: 36, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.3em', background: '#232323', color: '#e0e0e0', border: '1px solid #444', boxShadow: '0 2px 8px rgba(40,40,40,0.10)', transition: 'background 0.2s, color 0.2s' }}>&gt;</Button>
                  </div>
                  <div style={{ color: '#e0e0e0', marginTop: '1em', fontWeight: 500 }}>{`Photo ${currentIdx + 1} of ${carData.image_ids.length}`}</div>
                </div>
              ) : (
                <div style={{ color: '#b3b3b3', marginTop: '1em' }}>No images available.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
        );
    }
