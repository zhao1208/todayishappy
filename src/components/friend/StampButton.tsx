import React, { useState, useCallback } from 'react';

interface StampButtonProps {
  type: 'approve' | 'same' | 'hug';
  text: string;
  color: string;
  onClick: () => void;
}

const StampButton: React.FC<StampButtonProps> = ({ type, text, color, onClick }) => {
  const [pressing, setPressing] = useState(false);

  const handleMouseDown = useCallback(() => {
    setPressing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setPressing(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPressing(false);
  }, []);

  const handleClick = useCallback(() => {
    setPressing(true);
    // 保持按压态一小段时间再触发 onClick
    setTimeout(() => {
      setPressing(false);
      onClick();
    }, 150);
  }, [onClick]);

  const bgColors: Record<string, { bg: string; shadow: string; hover: string }> = {
    approve: {
      bg: '#FF4D4F',
      shadow: 'rgba(255,77,79,0.35)',
      hover: '#FF7875',
    },
    same: {
      bg: '#1677FF',
      shadow: 'rgba(22,119,255,0.35)',
      hover: '#4096FF',
    },
    hug: {
      bg: '#52C41A',
      shadow: 'rgba(82,196,26,0.35)',
      hover: '#73D13D',
    },
  };

  const palette = bgColors[type];

  const labels: Record<string, string> = {
    approve: '批准',
    same: '我也一样',
    hug: '抱一下',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: palette.bg,
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transform: pressing
            ? 'scale(0.88)'
            : 'scale(1)',
          transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease',
          boxShadow: pressing
            ? `0 2px 8px ${palette.shadow}`
            : `0 4px 16px ${palette.shadow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          lineHeight: 1.3,
        }}
      >
        {labels[type]}
      </button>
      <span
        style={{
          fontSize: 11,
          color: '#999',
          textAlign: 'center',
          maxWidth: 72,
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default StampButton;
