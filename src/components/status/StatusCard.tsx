import React from 'react';
import type { StatusOption } from '../../types/status';

interface StatusCardProps {
  status: StatusOption;
  selected: boolean;
  onClick: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, selected, onClick }) => {
  return (
    <div
      className={selected ? 'status-card-selected' : undefined}
      onClick={onClick}
      style={{
        borderRadius: 12,
        background: '#fff',
        padding: '14px 16px',
        cursor: 'pointer',
        border: selected ? '2px solid #FF6B6B' : '2px solid transparent',
        boxShadow: selected
          ? '0 2px 12px rgba(255, 107, 107, 0.25)'
          : '0 1px 4px rgba(0, 0, 0, 0.06)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{status.icon}</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: 6,
          lineHeight: 1.3,
        }}
      >
        {status.name}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {status.keywords.map((kw) => (
          <span
            key={kw}
            style={{
              fontSize: 11,
              color: '#999',
              background: '#F5F5F5',
              borderRadius: 4,
              padding: '2px 6px',
              lineHeight: '16px',
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StatusCard;
