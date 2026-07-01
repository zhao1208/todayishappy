import React, { useState, useMemo, useCallback } from 'react';
import { NavBar, FloatingBubble, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import { useUserStore } from '../store/UserContext';
import { useCommunityStore } from '../store/CommunityContext';
import { useCardStore } from '../store/CardContext';
import { communityThemes } from '../data/community-themes';
import { generateId } from '../utils/id-generator';
import type { CommunityPost, InteractionType } from '../types/community';
import AppLayout from '../components/layout/AppLayout';
import ThemeTabs from '../components/community/ThemeTabs';
import PostCard from '../components/community/PostCard';
import PostCreator from '../components/community/PostCreator';

const CommunityPage: React.FC = () => {
  const { profile } = useUserStore();
  const { posts, myInteractions, interact, getPostsByTheme, addPost } = useCommunityStore();
  const { currentCard } = useCardStore();
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [activeTheme, setActiveTheme] = useState('');

  const mode = profile?.mode || 'student';

  // 根据模式筛选主题
  const themes = useMemo(() => {
    return communityThemes.filter((t) => t.mode === mode || t.mode === 'all');
  }, [mode]);

  // 默认选中第一个主题
  const currentTheme = useMemo(() => {
    if (!activeTheme && themes.length > 0) {
      return themes[0].id;
    }
    return activeTheme || themes[0]?.id || '';
  }, [activeTheme, themes]);

  // 当前主题下的帖子
  const filteredPosts = useMemo(() => {
    return getPostsByTheme(currentTheme);
  }, [currentTheme, posts, getPostsByTheme]);

  const handleThemeChange = useCallback((themeId: string) => {
    setActiveTheme(themeId);
  }, []);

  const handleInteract = useCallback(
    (postId: string, type: InteractionType) => {
      interact(postId, type);
    },
    [interact],
  );

  const handlePublish = useCallback(
    (content: string, type: 'license' | 'resonance') => {
      if (!profile) {
        Toast.show({ icon: 'fail', content: '请先完善个人资料' });
        return;
      }
      const post: CommunityPost = {
        id: generateId(),
        authorId: profile.id,
        authorNickname: profile.nickname,
        type,
        themeId: currentTheme,
        cardData: type === 'license' && currentCard ? currentCard : undefined,
        textContent: content,
        interactions: { hug: 0, sameHere: 0, letItGo: 0, tomorrow: 0 },
        createdAt: new Date().toISOString(),
      };
      addPost(post);
      Toast.show({ icon: 'success', content: '发布成功！' });
    },
    [profile, currentTheme, currentCard, addPost],
  );

  return (
    <AppLayout>
      {/* NavBar */}
      <NavBar
        style={{
          '--border-bottom': '1px solid #F0F0F0',
          background: '#FFFFFF',
        } as React.CSSProperties}
      >
        低能量社区
      </NavBar>

      {/* 主题标签页 */}
      {themes.length > 0 && (
        <div style={{ background: '#FFFFFF', marginBottom: 8 }}>
          <ThemeTabs
            themes={themes}
            activeTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        </div>
      )}

      {/* 帖子列表 */}
      <div style={styles.postList}>
        {filteredPosts.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>{'\uD83D\uDCED'}</span>
            <span style={{ fontSize: 14, color: '#BBBBBB' }}>
              这里还没有内容，来发第一条吧
            </span>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              myInteractions={myInteractions[post.id] || []}
              onInteract={(type) => handleInteract(post.id, type)}
            />
          ))
        )}
      </div>

      {/* FAB 发布按钮 */}
      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
          '--size': '48px',
          '--background-color': '#FF6B6B',
        } as React.CSSProperties}
        onClick={() => setCreatorVisible(true)}
      >
        <AddOutline fontSize={24} color="#FFFFFF" />
      </FloatingBubble>

      {/* 发布弹窗 */}
      <PostCreator
        visible={creatorVisible}
        onClose={() => setCreatorVisible(false)}
        todayCard={currentCard}
        onPublish={handlePublish}
      />
    </AppLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  postList: {
    padding: '0 12px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
};

export default CommunityPage;
