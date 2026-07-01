import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, List, Popup, Dialog, Grid } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useUserStore } from '../store/UserContext';
import { useCardStore } from '../store/CardContext';
import { useCommunityStore } from '../store/CommunityContext';
import AppLayout from '../components/layout/AppLayout';
import type { CardData } from '../types/card';

/** 统计互动总数 */
function countInteractions(myInteractions: Record<string, string[]>): number {
  let total = 0;
  for (const key of Object.keys(myInteractions)) {
    total += myInteractions[key].length;
  }
  return total;
}

/** 格式化日期 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${mins}`;
}

/** 许可证卡片样式名映射 */
const STYLE_LABELS: Record<string, string> = {
  official: '公文风',
  diagnosis: '诊断书风',
  game: '游戏风',
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, session, isAdmin, setNickname, logout } = useUserStore();
  const { history } = useCardStore();
  const { myInteractions } = useCommunityStore();

  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');

  const modeLabel = profile?.mode === 'student' ? '学生模式' : '上班族模式';

  const stats = useMemo(() => {
    const cardCount = history.length;
    const interactionCount = countInteractions(myInteractions);
    // 微任务完成数：从历史卡片中统计（MVP 简化为卡片数的一半，近似值）
    const taskCount = Math.floor(cardCount * 0.6);
    return { cardCount, taskCount, interactionCount };
  }, [history, myInteractions]);

  const recentHistory = useMemo(() => {
    return history.slice(0, 10);
  }, [history]);

  const handleNicknameClick = useCallback(() => {
    if (profile) {
      setNicknameDraft(profile.nickname);
      setEditingNickname(true);
    }
  }, [profile]);

  const handleNicknameConfirm = useCallback(() => {
    if (nicknameDraft.trim()) {
      setNickname(nicknameDraft.trim());
    }
    setEditingNickname(false);
  }, [nicknameDraft, setNickname]);

  const handleModeSwitch = useCallback(() => {
    Dialog.confirm({
      content: '切换模式将清除当前用户数据，确定要重新选择吗？',
      confirmText: '确定切换',
      cancelText: '再想想',
      onConfirm: () => {
        logout();
        navigate('/onboarding');
      },
    });
  }, [logout, navigate]);

  const handleHistoryClick = useCallback(() => {
    setShowHistory(true);
  }, []);

  return (
    <AppLayout>
      <div style={{ padding: '16px 16px 24px' }}>
        {/* 用户信息卡片 */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '28px 20px 24px',
            textAlign: 'center',
            marginBottom: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          {/* 头像占位 */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: '#fff',
            }}
          >
            {profile?.mode === 'student' ? '📚' : '💼'}
          </div>

          {/* 昵称 */}
          <div style={{ marginBottom: 8 }}>
            {editingNickname ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <input
                  value={nicknameDraft}
                  onChange={(e) => setNicknameDraft(e.target.value)}
                  maxLength={12}
                  autoFocus
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    border: '1px solid #FF6B6B',
                    borderRadius: 8,
                    padding: '4px 12px',
                    textAlign: 'center',
                    width: 140,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNicknameConfirm();
                  }}
                />
                <span
                  onClick={handleNicknameConfirm}
                  style={{
                    fontSize: 13,
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  确认
                </span>
              </div>
            ) : (
              <span
                onClick={handleNicknameClick}
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  borderBottom: '1px dashed #ccc',
                  paddingBottom: 2,
                }}
              >
                {profile?.nickname || '未设置昵称'}
              </span>
            )}
            <p style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
              点击昵称可修改
            </p>
          </div>

          {/* 角色 + 模式标签 */}
          <div style={{ marginBottom: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Tag
              color="#FF6B6B"
              fill="outline"
              style={{
                '--border-radius': '8px',
                fontSize: 12,
                padding: '0 8px',
                lineHeight: '20px',
              } as React.CSSProperties}
            >
              {modeLabel}
            </Tag>
            {isAdmin && (
              <Tag
                color="#FAAD14"
                fill="outline"
                style={{
                  '--border-radius': '8px',
                  fontSize: 12,
                  padding: '0 8px',
                  lineHeight: '20px',
                } as React.CSSProperties}
              >
                管理员
              </Tag>
            )}
            <Tag
              color="#999"
              fill="outline"
              style={{
                '--border-radius': '8px',
                fontSize: 12,
                padding: '0 8px',
                lineHeight: '20px',
              } as React.CSSProperties}
            >
              @{session?.username || 'user'}
            </Tag>
          </div>

          {/* 数据统计 */}
          <Grid columns={3} gap={8}>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#FF6B6B' }}>
                  {stats.cardCount}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                  生成许可证
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#FF8E53' }}>
                  {stats.taskCount}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                  完成微任务
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1677FF' }}>
                  {stats.interactionCount}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                  社区互动
                </div>
              </div>
            </Grid.Item>
          </Grid>
        </div>

        {/* 功能列表 */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <List>
            <List.Item
              arrow={<RightOutline />}
              onClick={handleHistoryClick}
              description={history.length > 0 ? `${history.length}张` : '暂无'}
            >
              历史许可证
            </List.Item>
            <List.Item
              arrow={<RightOutline />}
              onClick={handleModeSwitch}
            >
              切换模式
            </List.Item>
            <List.Item
              arrow={<RightOutline />}
              onClick={() => navigate('/community')}
              description={stats.interactionCount > 0 ? `${stats.interactionCount}次` : ''}
            >
              社区互动记录
            </List.Item>
            {isAdmin && (
              <List.Item
                arrow={<RightOutline />}
                onClick={() => navigate('/admin/config')}
              >
                AI 配置
              </List.Item>
            )}
            <List.Item
              arrow={<RightOutline />}
              onClick={() => setShowAbout(true)}
            >
              关于
            </List.Item>
            <List.Item
              arrow
              onClick={() => {
                Dialog.confirm({
                  content: '确定要退出登录吗？',
                  confirmText: '退出',
                  cancelText: '取消',
                  onConfirm: () => {
                    logout();
                    navigate('/login', { replace: true });
                  },
                });
              }}
            >
              <span style={{ color: '#FF4D4F' }}>退出登录</span>
            </List.Item>
          </List>
        </div>

        {/* 底部心理援助热线 */}
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
          }}
        >
          <a
            href="tel:4001619995"
            style={{
              fontSize: 12,
              color: '#bbb',
              textDecoration: 'none',
            }}
          >
            24小时心理危机干预热线 400-161-9995
          </a>
        </div>
      </div>

      {/* 历史许可证弹窗 */}
      <Popup
        visible={showHistory}
        onMaskClick={() => setShowHistory(false)}
        position="bottom"
        bodyStyle={{
          borderRadius: '16px 16px 0 0',
          maxHeight: '70vh',
          overflow: 'auto',
          padding: '20px 16px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
            历史许可证
          </h3>
          <p style={{ fontSize: 12, color: '#999' }}>
            最近 {recentHistory.length} 张
          </p>
        </div>

        {recentHistory.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#ccc',
              fontSize: 14,
            }}
          >
            还没有生成过许可证哦
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentHistory.map((card: CardData) => (
              <div
                key={card.id}
                style={{
                  background: '#F5F0E8',
                  borderRadius: 12,
                  padding: '14px 16px',
                  border: '1px solid #8B7B6B',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#2C2C2C' }}>
                    {card.title}
                  </span>
                  <Tag
                    color="default"
                    fill="outline"
                    style={{
                      '--border-radius': '4px',
                      fontSize: 10,
                      padding: '0 4px',
                      lineHeight: '16px',
                    } as React.CSSProperties}
                  >
                    {STYLE_LABELS[card.style] || card.style}
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  {card.nickname} | {formatDate(card.createdAt)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#555',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  「{card.goldenQuote}」
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          <span
            onClick={() => setShowHistory(false)}
            style={{
              fontSize: 14,
              color: '#FF6B6B',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            关闭
          </span>
        </div>
      </Popup>

      {/* 关于弹窗 */}
      <Popup
        visible={showAbout}
        onMaskClick={() => setShowAbout(false)}
        position="bottom"
        bodyStyle={{
          borderRadius: '16px 16px 0 0',
          padding: '32px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#FF6B6B',
              marginBottom: 8,
              letterSpacing: 2,
            }}
          >
            今天也没废
          </h3>
          <p
            style={{
              fontSize: 14,
              color: '#999',
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            不是戒掉摆烂，而是防止你烂穿地心
          </p>
          <div
            style={{
              fontSize: 12,
              color: '#ccc',
              marginBottom: 8,
            }}
          >
            V1.0 MVP
          </div>
        </div>

        <div
          style={{
            background: '#F7F7F8',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.8, margin: 0 }}>
            24小时心理危机干预热线
            <br />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#FF6B6B' }}>
              400-161-9995
            </span>
          </p>
        </div>

        <span
          onClick={() => setShowAbout(false)}
          style={{
            fontSize: 14,
            color: '#FF6B6B',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          关闭
        </span>
      </Popup>
    </AppLayout>
  );
};

export default ProfilePage;
