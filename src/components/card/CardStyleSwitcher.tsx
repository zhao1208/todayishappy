import React from 'react';
import type { CardStyle } from '../../types/card';

interface CardStyleSwitcherProps {
  currentStyle: CardStyle;
  onStyleChange: (style: CardStyle) => void;
}

const styleConfig: { key: CardStyle; label: string }[] = [
  { key: 'official', label: '公文风' },
  { key: 'diagnosis', label: '诊断书风' },
  { key: 'game', label: '游戏风' },
];

const CardStyleSwitcher: React.FC<CardStyleSwitcherProps> = ({ currentStyle, onStyleChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '12px 0 8px',
      }}
    >
      {styleConfig.map((item) => {
        const isActive = currentStyle === item.key;
        return (
          <div
            key={item.key}
            onClick={() => onStyleChange(item.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
          >
            {/* Dot indicator */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isActive ? '#CC2222' : '#DDD',
                transition: 'background-color 0.2s ease',
              }}
            />
            {/* Label */}
            <span
              style={{
                fontSize: 12,
                color: isActive ? '#CC2222' : '#999',
                fontWeight: isActive ? 600 : 400,
                transition: 'color 0.2s ease',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CardStyleSwitcher;
