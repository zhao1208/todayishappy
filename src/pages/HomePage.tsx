import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd-mobile';
import { useUserStore } from '../store/UserContext';
import { useDailyCheck } from '../hooks/useDailyCheck';
import { getStatusesByMode } from '../data/statuses';
import { getGreeting } from '../utils/date';
import AppLayout from '../components/layout/AppLayout';
import StatusGrid from '../components/status/StatusGrid';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const { getTodayCard, setTodayStatus } = useDailyCheck();

  const mode = profile?.mode;
  const greeting = getGreeting();

  const statuses = useMemo(() => {
    if (!mode) return [];
    return getStatusesByMode(mode);
  }, [mode]);

  const todayCardId = getTodayCard();

  const subtitleText = mode === 'student'
    ? '不是戒掉摆烂，是防止你烂穿地心'
    : '不是让你立刻变好，而是让你别彻底掉线';

  const modeLabel = mode === 'student' ? '学生模式' : '上班族模式';

  const handleStatusSelect = (statusId: string) => {
    setTodayStatus(statusId);
    navigate(`/card/generate?statusId=${statusId}`);
  };

  return (
    <AppLayout>
      <div style={{ padding: '16px 16px 24px' }}>
        {/* 顶部区域 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>
              {greeting}
            </span>
            <Tag
              color="#FF6B6B"
              fill="outline"
              style={{
                '--border-radius': '8px',
                fontSize: 11,
                padding: '0 6px',
                lineHeight: '18px',
              } as React.CSSProperties}
            >
              {modeLabel}
            </Tag>
          </div>
          <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
            {subtitleText}
          </p>
        </div>

        {/* 状态选择器 */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: 16,
            }}
          >
            你今天是什么状态？
          </h2>
          <StatusGrid statuses={statuses} onStatusSelect={handleStatusSelect} />
        </div>

        {/* AI搭子快捷入口 */}
        <div
          onClick={() => navigate('/ai-chat')}
          style={{
            background: '#FFF0F0',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            marginBottom: 12,
            transition: 'transform 0.15s ease',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseDown={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: 28 }}>💬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>
              和AI摆烂搭子聊两句
            </div>
          </div>
          <span style={{ fontSize: 18, color: '#ccc' }}>&#x203A;</span>
        </div>

        {/* 今日许可证入口 */}
        {todayCardId && (
          <div
            onClick={() => navigate('/card/generate')}
            style={{
              background: '#F7F7F8',
              borderRadius: 12,
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseDown={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement;
              t.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: 14, color: '#666' }}>查看今日许可证</span>
            <span style={{ fontSize: 14, color: '#FF6B6B' }}>&rarr;</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default HomePage;
