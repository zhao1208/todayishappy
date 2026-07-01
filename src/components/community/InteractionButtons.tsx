import React, { useCallback } from 'react';
import type { PostInteractions, InteractionType } from '../../types/community';

interface InteractionButtonsProps {
  interactions: PostInteractions;
  myInteractions: InteractionType[];
  onInteract: (type: InteractionType) => void;
}

const interactionConfig: Array<{
  type: InteractionType;
  emoji: string;
  label: string;
  activeColor: string;
}> = [
  { type: 'hug', emoji: '\uD83D\uDC9D', label: '抱一下', activeColor: '#FF6B9D' },
  { type: 'sameHere', emoji: '\uD83E\uDD1D', label: '我也这样', activeColor: '#4A90D9' },
  { type: 'letItGo', emoji: '\uD83C\uDF43', label: '今天算了', activeColor: '#52C41A' },
  { type: 'tomorrow', emoji: '\uD83C\uDF19', label: '明天再说', activeColor: '#7B68EE' },
];

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  interactions,
  myInteractions,
  onInteract,
}) => {
  const handleClick = useCallback(
    (type: InteractionType) => {
      onInteract(type);
    },
    [onInteract],
  );

  return (
    <div style={styles.container}>
      {interactionConfig.map((item) => {
        const isActive = myInteractions.includes(item.type);
        const count = interactions[item.type];
        return (
          <button
            key={item.type}
            onClick={() => handleClick(item.type)}
            style={{
              ...styles.btn,
              background: isActive ? item.activeColor + '18' : '#F7F7F8',
              borderColor: isActive ? item.activeColor : '#E8E8E8',
              color: isActive ? item.activeColor : '#999',
            }}
          >
            <span style={styles.emoji}>{item.emoji}</span>
            <span style={styles.label}>{item.label}</span>
            {count > 0 && (
              <span style={{
                ...styles.count,
                color: isActive ? item.activeColor : '#BBBBBB',
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap' as const,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: '1px solid',
    borderRadius: 16,
    padding: '4px 10px',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
  },
  count: {
    fontSize: 11,
    fontWeight: 600,
  },
};

export default InteractionButtons;
