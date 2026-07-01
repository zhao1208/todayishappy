import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import ApproveCard from '../components/friend/ApproveCard';
import StampButton from '../components/friend/StampButton';
import StampAnimation from '../components/canvas/StampAnimation';

/** 盖章反馈文案映射 */
const STAMP_FEEDBACK: Record<string, string> = {
  approve: '批准摆烂，今日生效',
  same: '确认过眼神，是同一种废',
  hug: '远程抱抱已发送',
};

/** MVP 预置示例数据 */
const DEFAULT_DATA = {
  nickname: '摆烂侠阿强',
  title: '今日摆烂许可证',
  quote: '如果努力有用的话，那驴早就统治世界了',
};

/** 从 URL query 解析好友数据（MVP 简化：无数据时使用预置） */
function parseFriendData(params: URLSearchParams) {
  const nickname = params.get('nickname');
  const title = params.get('title');
  const quote = params.get('quote');
  if (nickname && title && quote) {
    return { nickname, title, quote };
  }
  return DEFAULT_DATA;
}

const FriendVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [approveText, setApproveText] = useState<string | null>(null);
  const [showStampAnim, setShowStampAnim] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const friendData = useMemo(() => parseFriendData(searchParams), [searchParams]);

  const handleStamp = useCallback((type: string) => {
    // 先播放印章动画
    setShowStampAnim(true);
    setApproveText(STAMP_FEEDBACK[type]);
    setFeedbackText(STAMP_FEEDBACK[type]);
  }, []);

  const handleStampDone = useCallback(() => {
    setShowStampAnim(false);
  }, []);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--app-bg, #F7F7F8)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* NavBar - 无 TabBar */}
      <NavBar
        onBack={() => navigate(-1)}
        left={<LeftOutline />}
        style={{
          '--border-bottom': '1px solid #f0f0f0',
          background: '#fff',
        } as React.CSSProperties}
      >
        批准摆烂
      </NavBar>

      {/* 主内容区 */}
      <div
        style={{
          flex: 1,
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* 提示文案 */}
        <p
          style={{
            fontSize: 15,
            color: '#666',
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 600, color: '#1A1A1A' }}>
            {friendData.nickname}
          </span>
          请求你批准TA今天的摆烂
        </p>

        {/* 许可证卡片 + 盖章动画容器 */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 360, marginBottom: 32 }}>
          <ApproveCard
            nickname={friendData.nickname}
            title={friendData.title}
            quote={friendData.quote}
            approveText={approveText}
          />
          {/* 复用 StampAnimation 组件 */}
          <StampAnimation visible={showStampAnim} onDone={handleStampDone} />
        </div>

        {/* 盖章按钮区域 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            marginBottom: 32,
          }}
        >
          <StampButton
            type="approve"
            text="批准摆烂，今日生效"
            color="#FF4D4F"
            onClick={() => handleStamp('approve')}
          />
          <StampButton
            type="same"
            text="确认过眼神，是同一种废"
            color="#1677FF"
            onClick={() => handleStamp('same')}
          />
          <StampButton
            type="hug"
            text="远程抱抱已发送"
            color="#52C41A"
            onClick={() => handleStamp('hug')}
          />
        </div>

        {/* 盖章反馈文案 */}
        {feedbackText && (
          <div
            className="fade-in"
            style={{
              textAlign: 'center',
              marginBottom: 24,
              padding: '12px 24px',
              background: '#FFF0F0',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              color: '#FF6B6B',
            }}
          >
            {feedbackText}
          </div>
        )}

        {/* 底部 CTA */}
        <div style={{ marginTop: 'auto', width: '100%', maxWidth: 360 }}>
          <button
            onClick={handleGoHome}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 24,
              border: '2px solid #FF6B6B',
              backgroundColor: 'transparent',
              color: '#FF6B6B',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 200ms ease',
              WebkitTapHighlightColor: 'transparent',
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
            我也来领一张许可证
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendVerifyPage;
