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
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  // Lightbox handlers
  const handleLightboxNext = () => {
    const ids = carData.image_ids;
    if (currentIdx < ids.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleLightboxPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  // Handle keyboard navigation in lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, currentIdx, carData.image_ids]);

  // Show loading spinner if carData is not ready or does not match carId
    if (!carData || String(carData.id) !== String(carId)) {
      return (
        <div style={{ 
          width: '100vw',
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
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
          <Card style={{ 
            padding: '2.5rem', 
            borderRadius: 24, 
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 80px rgba(100,108,255,0.1)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '4px solid rgba(102,126,234,0.2)',
                borderTop: '4px solid #667eea',
                animation: 'spin 1s linear infinite'
              }} />
              <Title level={3} style={{ color: '#333', margin: 0 }}>Loading car details...</Title>
            </div>
          </Card>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
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
      <div style={{ 
        width: '100vw',
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
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

        <Card style={{ 
          maxWidth: 1100, 
          width: '100%', 
          borderRadius: 24, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 80px rgba(100,108,255,0.1)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)',
          padding: '2.5rem',
          zIndex: 10
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ 
              margin: 0,
              color: '#333',
              textAlign: 'center', 
              fontWeight: 700, 
              fontSize: '2.4em', 
              letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {carData.car.Car_Name || 'Car Details'}
            </h2>
          </div>

          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            gap: '3rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* Car details section */}
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <h3 style={{ color: '#333', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>📋 Details</h3>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.9em' }}>
                <tbody>
                  {Object.entries(carData.car).map(([key, value]) => (
                    key !== 'Car_Name' && (
                      <tr key={key}>
                        <td style={{ 
                          color: '#666', 
                          fontWeight: 600, 
                          padding: '0.6em 1.5rem 0.6em 0', 
                          textAlign: 'right', 
                          minWidth: 140, 
                          fontSize: '0.95rem',
                          borderRight: '2px solid rgba(102,126,234,0.2)'
                        }}>
                          {key.replace(/_/g, ' ')}:
                        </td>
                        <td style={{ 
                          color: '#333', 
                          padding: '0.6em 0 0.6em 1.5rem', 
                          fontSize: '0.95rem', 
                          fontWeight: 500 
                        }}>
                          {value}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
              <button 
                onClick={handleSearchAnother} 
                style={{ 
                  marginTop: '2rem', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '0.85rem 2.2rem',
                  boxShadow: '0 4px 16px rgba(102,126,234,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(102,126,234,0.4)';
                }}
              >
                🔍 Search Another Car
              </button>
            </div>

            {/* Image Gallery section */}
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <h3 style={{ color: '#333', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', width: '100%', textAlign: 'center' }}>🖼️ Gallery</h3>
              {carData.image_ids && carData.image_ids.length > 0 ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                    <button 
                      disabled={currentIdx === 0} 
                      onClick={handlePrev} 
                      style={{ 
                        borderRadius: '50%', 
                        width: 48, 
                        height: 48, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        fontSize: '1.4em',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
                        cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentIdx === 0 ? 0.5 : 1,
                        transition: 'all 0.3s ease',
                        position: 'absolute',
                        left: '-70px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 5
                      }}
                      onMouseEnter={(e) => {
                        if (currentIdx > 0) {
                          e.target.style.transform = 'translateY(-50%) scale(1.1)';
                          e.target.style.boxShadow = '0 6px 16px rgba(102,126,234,0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.3)';
                      }}
                    >
                      ◀
                    </button>
                    <div 
                      onClick={() => setLightboxOpen(true)}
                      style={{ 
                        width: '100%',
                        maxWidth: '420px',
                        height: '320px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        background: '#f5f5f7',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                        border: '2px solid #e0e0e0',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 28px rgba(102,126,234,0.3)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {loadingImg || !imageCache[carData.image_ids[currentIdx]] ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            border: '4px solid rgba(102,126,234,0.2)',
                            borderTop: '4px solid #667eea',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Loading...</p>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={imageCache[carData.image_ids[currentIdx]]} 
                            alt={`Car photo ${currentIdx + 1}`} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              objectFit: 'cover',
                              borderRadius: '12px'
                            }} 
                          />
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0)',
                            borderRadius: '12px',
                            transition: 'background 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0)';
                          }}
                          >
                          </div>
                        </>
                      )}
                    </div>
                    <button 
                      disabled={currentIdx === carData.image_ids.length - 1} 
                      onClick={handleNext} 
                      style={{ 
                        borderRadius: '50%', 
                        width: 48, 
                        height: 48, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        fontSize: '1.4em',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
                        cursor: currentIdx === carData.image_ids.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentIdx === carData.image_ids.length - 1 ? 0.5 : 1,
                        transition: 'all 0.3s ease',
                        position: 'absolute',
                        right: '-70px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 5
                      }}
                      onMouseEnter={(e) => {
                        if (currentIdx < carData.image_ids.length - 1) {
                          e.target.style.transform = 'translateY(-50%) scale(1.1)';
                          e.target.style.boxShadow = '0 6px 16px rgba(102,126,234,0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(-50%)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.3)';
                      }}
                    >
                      ▶
                    </button>
                  </div>
                  <div style={{ 
                    color: '#333', 
                    marginTop: '0.5rem', 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(102,126,234,0.2)',
                    fontSize: '0.9rem'
                  }}>
                    📷 Photo {currentIdx + 1} of {carData.image_ids.length}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#999', marginTop: '2rem', fontSize: '1rem', textAlign: 'center' }}>📷 No images available.</div>
              )}
            </div>
          </div>
        </Card>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div 
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '90vw',
                maxHeight: '90vh'
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '0',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  zIndex: 1001
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>

              {/* Image display */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}>
                {/* Previous button */}
                <button
                  onClick={handleLightboxPrev}
                  disabled={currentIdx === 0}
                  style={{
                    position: 'absolute',
                    left: '-80px',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    fontSize: '1.8rem',
                    cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIdx === 0 ? 0.3 : 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 1001
                  }}
                  onMouseEnter={(e) => {
                    if (currentIdx > 0) {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ◀
                </button>

                {/* Main image */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: '90vw',
                  maxHeight: '80vh'
                }}>
                  {loadingImg ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '4px solid rgba(255,255,255,0.2)',
                        borderTop: '4px solid #fff',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <p style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 500 }}>Loading...</p>
                    </div>
                  ) : (
                    <img 
                      src={imageCache[carData.image_ids[currentIdx]]} 
                      alt={`Car photo ${currentIdx + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        boxShadow: '0 0 40px rgba(102,126,234,0.4)'
                      }}
                    />
                  )}
                </div>

                {/* Next button */}
                <button
                  onClick={handleLightboxNext}
                  disabled={currentIdx === carData.image_ids.length - 1}
                  style={{
                    position: 'absolute',
                    right: '-80px',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    fontSize: '1.8rem',
                    cursor: currentIdx === carData.image_ids.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIdx === carData.image_ids.length - 1 ? 0.3 : 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 1001
                  }}
                  onMouseEnter={(e) => {
                    if (currentIdx < carData.image_ids.length - 1) {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  ▶
                </button>
              </div>

              {/* Photo counter */}
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                📷 Photo {currentIdx + 1} of {carData.image_ids.length}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
    }
