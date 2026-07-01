import React from 'react';

interface IdentityCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  onClick: () => void;
}

const IdentityCard: React.FC<IdentityCardProps> = ({
  title,
  subtitle,
  icon,
  gradient,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 16,
        padding: '20px 24px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseDown={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(0.97)';
      }}
      onTouchEnd={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'scale(1)';
      }}
    >
      <div
        style={{
          fontSize: 48,
          flexShrink: 0,
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default IdentityCard;
