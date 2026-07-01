import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/UserContext';
import IdentityCard from '../components/identity/IdentityCard';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setMode } = useUserStore();

  const handleStudentSelect = () => {
    setMode('student');
    navigate('/');
  };

  const handleWorkerSelect = () => {
    setMode('worker');
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: '#F7F7F8',
      }}
    >
      {/* 顶部品牌区域 */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#FF6B6B',
            marginBottom: 12,
            letterSpacing: 2,
          }}
        >
          今天也没废
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#999',
            lineHeight: 1.5,
          }}
        >
          不是戒掉摆烂，而是防止你烂穿地心
        </p>
      </div>

      {/* 身份选择卡片 */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <IdentityCard
          title="学生模式"
          subtitle="论文、考试、考研、迷茫——你不是一个人"
          icon="📚"
          gradient="linear-gradient(135deg, #8B5CF6, #3B82F6)"
          onClick={handleStudentSelect}
        />
        <IdentityCard
          title="上班族模式"
          subtitle="会议、KPI、加班、通勤——电量低不是你的错"
          icon="💼"
          gradient="linear-gradient(135deg, #F97316, #EC4899)"
          onClick={handleWorkerSelect}
        />
      </div>

      {/* 底部品牌说明 */}
      <div
        style={{
          marginTop: 48,
          textAlign: 'center',
          fontSize: 11,
          color: '#ccc',
          lineHeight: 1.6,
        }}
      >
        <p>今天也没废 -- 让每一天都有个交代</p>
      </div>
    </div>
  );
};

export default OnboardingPage;
