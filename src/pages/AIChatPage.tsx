import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/UserContext';
import { useDailyCheck } from '../hooks/useDailyCheck';
import { useAIChat } from '../hooks/useAIChat';
import { getStatusById } from '../data/statuses';
import ChatBubble from '../components/ai/ChatBubble';
import ChatInput from '../components/ai/ChatInput';
import TypingIndicator from '../components/ai/TypingIndicator';

const quickReplies = ['我不想动', '好累啊', '让我摆烂'];

const AIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const { getTodayStatus } = useDailyCheck();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  const mode = profile?.mode;
  const { statusId: todayStatusId } = getTodayStatus();
  const currentStatusId = todayStatusId || '';

  // 获取状态名称（必须在 useAIChat 之前声明）
  const statusName = useMemo(() => {
    if (!currentStatusId) return null;
    const status = getStatusById(currentStatusId);
    return status?.name || null;
  }, [currentStatusId]);

  const { messages, isTyping, error, send } = useAIChat(
    currentStatusId || 'fallback',
    mode || 'student',
    statusName,
  );

  // 生成AI开场白
  const greetingText = useMemo(() => {
    if (statusName) {
      return `检测到你今天是「${statusName}」状态。没关系，我在这儿陪你。想说点什么？`;
    }
    return '你好呀，我是你的AI摆烂搭子。今天过得怎么样？想吐槽还是想摆烂，都可以跟我说。';
  }, [statusName]);

  // 发送开场白
  useEffect(() => {
    if (!hasGreeted && mode) {
      setHasGreeted(true);
    }
  }, [mode, hasGreeted]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    (text: string) => {
      send(text);
    },
    [send],
  );

  const handleQuickReply = useCallback(
    (text: string) => {
      send(text);
    },
    [send],
  );

  return (
    <div style={styles.page}>
      {/* NavBar */}
      <NavBar
        onBack={() => navigate(-1)}
        style={{
          '--border-bottom': '1px solid #F0F0F0',
          '--height': '48px',
        } as React.CSSProperties}
      >
        AI摆烂搭子
      </NavBar>

      {/* 消息列表 */}
      <div style={styles.messageList}>
        {/* AI开场白 */}
        <div style={styles.aiRow}>
          <div style={styles.aiBubbleWrapper}>
            <div style={styles.aiBubble}>
              <span style={styles.aiText}>{greetingText}</span>
            </div>
          </div>
        </div>

        {/* 消息列表 */}
        {messages.map((msg) => (
          <div key={msg.id} className="fade-in">
            <ChatBubble message={msg} isUser={msg.role === 'user'} />
          </div>
        ))}

        {/* Typing 指示器 */}
        {isTyping && <TypingIndicator />}

        {/* API 错误提示 */}
        {error && (
          <div style={styles.errorRow}>
            <div style={styles.errorBubble}>{error}</div>
          </div>
        )}

        {/* 底部锚点 */}
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      {/* 快捷回复 */}
      {messages.length === 0 && (
        <div style={styles.quickReplies}>
          {quickReplies.map((text) => (
            <button
              key={text}
              onClick={() => handleQuickReply(text)}
              style={styles.quickBtn}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* 输入框 */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#F7F7F8',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 8,
    WebkitOverflowScrolling: 'touch' as any,
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
  },
  quickReplies: {
    display: 'flex',
    gap: 8,
    padding: '8px 16px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch' as any,
  },
  quickBtn: {
    whiteSpace: 'nowrap',
    background: '#FFFFFF',
    border: '1px solid #FFE0E0',
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: 13,
    color: '#FF6B6B',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
  errorRow: {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 16px',
  },
  errorBubble: {
    background: '#FFF2F0',
    border: '1px solid #FFCCC7',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 12,
    color: '#FF4D4F',
    maxWidth: '80%',
    textAlign: 'center',
  },
};

export default AIChatPage;
