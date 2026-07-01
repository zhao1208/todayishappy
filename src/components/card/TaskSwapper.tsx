import React from 'react';

interface TaskSwapperProps {
  currentTask: string;
  onSwap: () => void;
}

const TaskSwapper: React.FC<TaskSwapperProps> = ({ currentTask, onSwap }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        backgroundColor: '#F7F7F8',
        borderRadius: 12,
      }}
    >
      {/* Current task text */}
      <div
        style={{
          flex: 1,
          fontSize: 14,
          color: '#333',
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>今日微任务</div>
        <div>{currentTask}</div>
      </div>

      {/* Swap button */}
      <div
        onClick={onSwap}
        style={{
          flexShrink: 0,
          fontSize: 13,
          color: '#FF6B6B',
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: 20,
          border: '1px solid #FF6B6B',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          transition: 'background-color 0.15s ease',
          userSelect: 'none',
          lineHeight: '20px',
        }}
        onMouseDown={(e) => {
          const t = e.currentTarget as HTMLElement;
          t.style.backgroundColor = '#FFF0F0';
        }}
        onMouseUp={(e) => {
          const t = e.currentTarget as HTMLElement;
          t.style.backgroundColor = 'transparent';
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget as HTMLElement;
          t.style.backgroundColor = 'transparent';
        }}
      >
        换一个
      </div>
    </div>
  );
};

export default TaskSwapper;
