import React, { useEffect, useState } from 'react';

interface StampAnimationProps {
  visible: boolean;
  onDone: () => void;
}

const StampAnimation: React.FC<StampAnimationProps> = ({ visible, onDone }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      // Delay one frame to trigger CSS transition
      requestAnimationFrame(() => {
        setAnimating(true);
      });

      const timer = setTimeout(() => {
        setAnimating(false);
        onDone();
      }, 400);

      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
    }
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: animating ? 'auto' : 'none',
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: 8,
        }}
      />

      {/* Stamp element */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '4px solid #CC2222',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transform: animating ? 'translateY(0) scale(1) rotate(-15deg)' : 'translateY(-80px) scale(0.5) rotate(-15deg)',
          opacity: animating ? 1 : 0,
          transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
          fontFamily: '"Noto Serif SC", serif',
          color: '#CC2222',
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.3,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 4px 20px rgba(204, 34, 34, 0.25)',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 900 }}>准许</span>
        <span style={{ fontSize: 11, fontWeight: 400, marginTop: 2 }}>摆烂</span>
      </div>
    </div>
  );
};

export default StampAnimation;
