import React from 'react';

export default function ChillingLogo({ size = 34, showText = true, onClick }) {
  return (
    <div 
      className="logo-brand" 
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', userSelect: 'none' }}
    >
      {/* Special Chilling 3D Emblem Mark */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #E50914 0%, #ff4d4d 50%, #b20710 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(229, 9, 20, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        position: 'relative',
        fontWeight: 900,
        color: 'white',
        fontSize: `${size * 0.62}px`,
        letterSpacing: '-0.5px'
      }}>
        <span>C</span>
        <div style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#46d369',
          boxShadow: '0 0 10px #46d369'
        }} />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ 
            fontSize: `${size * 0.72}px`, 
            fontWeight: 900, 
            letterSpacing: '-0.5px', 
            color: '#E50914',
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(229, 9, 20, 0.3)'
          }}>
            CHILLING
          </span>
          <span className="brand-badge" style={{ marginTop: '2px', width: 'fit-content' }}>
            MATCH AI
          </span>
        </div>
      )}
    </div>
  );
}
