import React, { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    // 重置输入框高度
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    // 自动调整高度
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }, []);

  return (
    <div style={styles.container}>
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="说点什么..."
        disabled={disabled}
        rows={1}
        style={{
          ...styles.input,
          opacity: disabled ? 0.6 : 1,
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          ...styles.sendBtn,
          opacity: disabled || !text.trim() ? 0.4 : 1,
        }}
      >
        发送
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    padding: '10px 16px',
    background: '#FFFFFF',
    borderTop: '1px solid #F0F0F0',
    position: 'sticky',
    bottom: 0,
  },
  input: {
    flex: 1,
    border: '1px solid #E8E8E8',
    borderRadius: 20,
    padding: '8px 16px',
    fontSize: 15,
    lineHeight: '22px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    background: '#F7F7F8',
    color: '#1A1A1A',
  },
  sendBtn: {
    background: '#FF6B6B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 20,
    padding: '8px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
};

export default ChatInput;
