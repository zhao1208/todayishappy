import React from 'react';
import type { CommunityPost } from '../../types/community';
import InteractionButtons from './InteractionButtons';

interface PostCardProps {
  post: CommunityPost;
  myInteractions: string[];
  onInteract: (type: 'hug' | 'sameHere' | 'letItGo' | 'tomorrow') => void;
}

function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 7) return `${diffDay}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

const PostCard: React.FC<PostCardProps> = ({ post, myInteractions, onInteract }) => {
  return (
    <div style={styles.card}>
      {/* 作者信息 */}
      <div style={styles.authorRow}>
        <div style={styles.avatar}>
          {post.authorNickname.charAt(0)}
        </div>
        <div style={styles.authorInfo}>
          <span style={styles.nickname}>{post.authorNickname}</span>
          <span style={styles.time}>{formatTime(post.createdAt)}</span>
        </div>
        <span style={styles.typeTag}>
          {post.type === 'license' ? '今日许可证' : '共鸣'}
        </span>
      </div>

      {/* 帖子内容 */}
      <div style={styles.content}>
        {post.type === 'license' && post.cardData ? (
          <div style={styles.licenseCard}>
            <div style={styles.licenseTitle}>{post.cardData.title}</div>
            <div style={styles.licenseQuote}>"{post.cardData.goldenQuote}"</div>
          </div>
        ) : (
          <span style={styles.textContent}>{post.textContent}</span>
        )}
      </div>

      {/* 互动按钮 */}
      <InteractionButtons
        interactions={post.interactions}
        myInteractions={myInteractions as any}
        onInteract={onInteract}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#FFE0E0',
    color: '#FF6B6B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  authorInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  nickname: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1A1A1A',
    lineHeight: '20px',
  },
  time: {
    fontSize: 11,
    color: '#BBBBBB',
    lineHeight: '16px',
  },
  typeTag: {
    fontSize: 11,
    color: '#FF6B6B',
    background: '#FFF0F0',
    padding: '2px 8px',
    borderRadius: 8,
    fontWeight: 500,
  },
  content: {
    marginBottom: 4,
  },
  licenseCard: {
    background: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    borderLeft: '3px solid #FF6B6B',
  },
  licenseTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  licenseQuote: {
    fontSize: 13,
    color: '#666666',
    fontStyle: 'italic',
    lineHeight: '20px',
  },
  textContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: '22px',
    wordBreak: 'break-word',
  },
};

export default PostCard;
