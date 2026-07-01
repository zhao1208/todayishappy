import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.bubble}>
        <div style={styles.dotsWrapper}>
          <span style={{ ...styles.dot, animationDelay: '0ms' }} />
          <span style={{ ...styles.dot, animationDelay: '150ms' }} />
          <span style={{ ...styles.dot, animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '8px 16px',
  },
  bubble: {
    background: '#F5F5F5',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: '12px 16px',
    display: 'inline-block',
  },
  dotsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#AAAAAA',
    animation: 'typingBounce 0.6s infinite ease-in-out',
  },
};

export default TypingIndicator;
