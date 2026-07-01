import React from 'react';

interface ApproveCardProps {
  nickname: string;
  title: string;
  quote: string;
  approveText: string | null;
}

const ApproveCard: React.FC<ApproveCardProps> = ({ nickname, title, quote, approveText }) => {
  return (
    <div
      style={{
        background: '#F5F0E8',
        borderRadius: 16,
        padding: '24px 20px',
        position: 'relative',
        border: '2px solid #8B7B6B',
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
      }}
    >
      {/* 左上角装饰线 */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 24,
          height: 24,
          borderTop: '3px solid #C41E3A',
          borderLeft: '3px solid #C41E3A',
        }}
      />
      {/* 右下角装饰线 */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 24,
          height: 24,
          borderBottom: '3px solid #C41E3A',
          borderRight: '3px solid #C41E3A',
        }}
      />

      {/* 标题区 */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div
          style={{
            fontSize: 12,
            color: '#8B7B6B',
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          摆烂许可证
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#2C2C2C',
          }}
        >
          {title}
        </div>
      </div>

      {/* 持证人 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 14, color: '#666' }}>持证人：</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2C' }}>
          {nickname}
        </span>
      </div>

      {/* 分隔线 */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(to right, transparent, #8B7B6B, transparent)',
          marginBottom: 16,
        }}
      />

      {/* 金句 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 14,
          color: '#555',
          lineHeight: 1.8,
          fontStyle: 'italic',
          padding: '0 12px',
        }}
      >
        「{quote}」
      </div>

      {/* 盖章反馈 */}
      {approveText && (
        <div
          className="fade-in"
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '3px solid #CC2222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-15deg)',
            color: '#CC2222',
            fontWeight: 700,
            fontSize: 11,
            lineHeight: 1.3,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 2px 8px rgba(204,34,34,0.2)',
          }}
        >
          {approveText.length > 4 ? (
            <>
              <span style={{ fontSize: 14 }}>已批准</span>
              <br />
              <span>{approveText.slice(0, 4)}</span>
            </>
          ) : (
            <span>{approveText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ApproveCard;
