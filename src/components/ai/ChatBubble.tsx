import React from 'react';
import type { ChatMessage } from '../../types/ai';

interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

const stageConfig: Record<string, { label: string; color: string; bg: string }> = {
  empathy: { label: '接住情绪', color: '#FF6B9D', bg: '#FFF0F5' },
  mouthpiece: { label: '嘴替时间', color: '#4A90D9', bg: '#EBF3FD' },
  microAction: { label: '微行动', color: '#52C41A', bg: '#F0FFF0' },
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
  if (isUser) {
    return (
      <div style={styles.userRow}>
        <div style={styles.userBubble}>
          <span style={styles.userText}>{message.content}</span>
        </div>
      </div>
    );
  }

  const stageInfo = message.stage ? stageConfig[message.stage] : null;

  return (
    <div style={styles.aiRow}>
      <div style={styles.aiBubbleWrapper}>
        {stageInfo && (
          <span style={{
            ...styles.stageTag,
            color: stageInfo.color,
            background: stageInfo.bg,
          }}>
            {stageInfo.label}
          </span>
        )}
        <div style={styles.aiBubble}>
          <span style={styles.aiText}>{message.content}</span>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  userRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 16px',
  },
  userBubble: {
    background: '#FF6B6B',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: '10px 16px',
    maxWidth: '75%',
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: '22px',
    wordBreak: 'break-word',
  },
  aiRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '8px 16px',
  },
  aiBubbleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '75%',
  },
  aiBubble: {
    background: '#F5F5F5',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: '10px 16px',
  },
  aiText: {
    color: '#1A1A1A',
    fontSize: 15,
    lineHeight: '22px',
    wordBreak: 'break-word',
  },
  stageTag: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 8,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
};

export default ChatBubble;
