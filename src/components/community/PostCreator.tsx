import React, { useState, useCallback } from 'react';
import { Popup, TextArea, Button } from 'antd-mobile';
import type { CardData } from '../../types/card';

interface PostCreatorProps {
  visible: boolean;
  onClose: () => void;
  todayCard: CardData | null;
  onPublish: (content: string, type: 'license' | 'resonance') => void;
}

type CreatorTab = 'license' | 'resonance';

const PostCreator: React.FC<PostCreatorProps> = ({
  visible,
  onClose,
  todayCard,
  onPublish,
}) => {
  const [activeTab, setActiveTab] = useState<CreatorTab>(
    todayCard ? 'license' : 'resonance',
  );
  const [resonanceText, setResonanceText] = useState('');

  const handlePublish = useCallback(() => {
    if (activeTab === 'license' && todayCard) {
      // 发布许可证卡片：用金句和标题作为内容
      const content = `${todayCard.title}\n${todayCard.goldenQuote}`;
      onPublish(content, 'license');
    } else if (activeTab === 'resonance') {
      const trimmed = resonanceText.trim();
      if (!trimmed) return;
      onPublish(trimmed, 'resonance');
      setResonanceText('');
    }
    onClose();
  }, [activeTab, todayCard, resonanceText, onPublish, onClose]);

  const handleClose = useCallback(() => {
    setResonanceText('');
    onClose();
  }, [onClose]);

  return (
    <Popup
      visible={visible}
      onMaskClick={handleClose}
      position="bottom"
      bodyStyle={{
        borderRadius: '16px 16px 0 0',
        minHeight: '40vh',
        maxHeight: '70vh',
      }}
    >
      <div style={styles.container}>
        {/* 标题 */}
        <div style={styles.header}>
          <span style={styles.title}>发布到社区</span>
          <button onClick={handleClose} style={styles.closeBtn}>x</button>
        </div>

        {/* Tab 切换 */}
        <div style={styles.tabRow}>
          <button
            onClick={() => setActiveTab('license')}
            disabled={!todayCard}
            style={{
              ...styles.tabBtn,
              background: activeTab === 'license' ? '#FF6B6B' : '#F5F5F5',
              color: activeTab === 'license' ? '#FFFFFF' : '#666',
              opacity: todayCard ? 1 : 0.4,
            }}
          >
            发布今日许可证
          </button>
          <button
            onClick={() => setActiveTab('resonance')}
            style={{
              ...styles.tabBtn,
              background: activeTab === 'resonance' ? '#FF6B6B' : '#F5F5F5',
              color: activeTab === 'resonance' ? '#FFFFFF' : '#666',
            }}
          >
            发共鸣卡片
          </button>
        </div>

        {/* 内容区域 */}
        <div style={styles.body}>
          {activeTab === 'license' && todayCard ? (
            <div style={styles.licensePreview}>
              <div style={styles.licenseIcon}>
                <span style={{ fontSize: 32 }}>{todayCard.title.includes('学生') ? '\uD83C\uDF93' : '\uD83D\uDCBC'}</span>
              </div>
              <div style={styles.licenseInfo}>
                <div style={styles.licenseTitle}>{todayCard.title}</div>
                <div style={styles.licenseQuote}>"{todayCard.goldenQuote}"</div>
                <div style={styles.licenseHint}>
                  分享你的今日许可证，让社区看看你没废！
                </div>
              </div>
            </div>
          ) : (
            <TextArea
              value={resonanceText}
              onChange={(val) => setResonanceText(val)}
              placeholder="说说你的心情，或者分享你的摆烂日常..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              style={{
                '--font-size': '15px',
                borderRadius: 12,
              } as React.CSSProperties}
            />
          )}
        </div>

        {/* 发布按钮 */}
        <div style={styles.footer}>
          <Button
            block
            color="primary"
            style={{
              '--background-color': '#FF6B6B',
              '--border-radius': '24px',
              '--text-color': '#FFFFFF',
            } as React.CSSProperties}
            onClick={handlePublish}
            disabled={activeTab === 'resonance' && !resonanceText.trim()}
          >
            发布
          </Button>
        </div>
      </div>
    </Popup>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: 'none',
    background: '#F5F5F5',
    color: '#999',
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 12,
    border: 'none',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  body: {
    flex: 1,
  },
  licensePreview: {
    background: '#FFF8F0',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    gap: 16,
  },
  licenseIcon: {
    width: 60,
    height: 60,
    background: '#FFFFFF',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  licenseInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  licenseQuote: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: '22px',
    marginBottom: 12,
  },
  licenseHint: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  footer: {
    paddingTop: 16,
  },
};

export default PostCreator;
