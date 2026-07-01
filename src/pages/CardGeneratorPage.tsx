import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar, Button, Toast, SafeArea } from 'antd-mobile';
import { useCardStore } from '../store/CardContext';
import { useUserStore } from '../store/UserContext';
import { useCardExport } from '../hooks/useCardExport';
import { getCardTemplate } from '../data/card-templates';
import { getMicroTasks } from '../data/micro-tasks';
import { getGoldenQuotes } from '../data/golden-quotes';
import { generateId, generateSerialNo } from '../utils/id-generator';
import type { CardData, CardStyle } from '../types/card';
import CardPreview from '../components/card/CardPreview';
import CardStyleSwitcher from '../components/card/CardStyleSwitcher';
import NicknameEditor from '../components/card/NicknameEditor';
import TaskSwapper from '../components/card/TaskSwapper';

/** Pick a random element from an array */
function pickRandom<T>(arr: T[]): T {
  if (arr.length === 0) return '' as T;
  return arr[Math.floor(Math.random() * arr.length)];
}

const CardGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusId = searchParams.get('statusId') || '';

  const { profile } = useUserStore();
  const { currentCard, setCurrentCard, updateCurrentCard, addToHistory } = useCardStore();
  const { exportCard } = useCardExport();

  const [showStampAnimation, setShowStampAnimation] = useState(true);
  const [nicknameEditorVisible, setNicknameEditorVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ====== Initialization: construct CardData ======
  const initializedCard = useMemo(() => {
    if (!profile) return null;

    const template = getCardTemplate(statusId, profile.mode);
    const tasks = getMicroTasks(statusId);
    const quotes = getGoldenQuotes(statusId);

    const cardData: CardData = {
      id: generateId(),
      serialNo: generateSerialNo(profile.mode),
      style: profile.preferredCardStyle || 'official',
      statusId,
      mode: profile.mode,
      nickname: profile.nickname,
      title: template?.title || '摆烂许可证',
      reasonText: template?.reasonText || '',
      permitText: template?.permitText || '',
      microTask: pickRandom(tasks),
      goldenQuote: pickRandom(quotes),
      createdAt: new Date().toISOString(),
    };

    return cardData;
  }, [profile, statusId]);

  // Set card to store on first load
  useEffect(() => {
    if (initializedCard) {
      setCurrentCard(initializedCard);
      addToHistory(initializedCard);
    }
  }, [initializedCard, setCurrentCard, addToHistory]);

  // The card to render (either from store or initialized)
  const cardData = currentCard || initializedCard;

  // ====== Handlers ======

  const handleStyleChange = useCallback((style: CardStyle) => {
    updateCurrentCard({ style });
  }, [updateCurrentCard]);

  const handleNicknameConfirm = useCallback((newNickname: string) => {
    updateCurrentCard({ nickname: newNickname });
  }, [updateCurrentCard]);

  const handleTaskSwap = useCallback(() => {
    if (!cardData) return;
    const tasks = getMicroTasks(cardData.statusId);
    // Pick a different task if possible
    const available = tasks.filter((t) => t !== cardData.microTask);
    const newTask = available.length > 0 ? pickRandom(available) : pickRandom(tasks);
    updateCurrentCard({ microTask: newTask });
  }, [cardData, updateCurrentCard]);

  const handleSaveImage = useCallback(() => {
    if (!canvasRef.current) {
      Toast.show({ content: '卡片未就绪，请稍候', position: 'center' });
      return;
    }
    const filename = cardData ? `今天也没废-${cardData.title}` : '今天也没废-许可证';
    exportCard(canvasRef.current, filename);
  }, [cardData, exportCard]);

  const handleShareToFriend = useCallback(() => {
    if (!cardData) return;
    const text = `[今天也没废] ${cardData.title}\n持证人：${cardData.nickname}\n编号：${cardData.serialNo}\n\n${cardData.goldenQuote}\n\n快来领取你的摆烂许可证吧！`;
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        Toast.show({ content: '文案已复制，快去分享吧', icon: 'success', position: 'center' });
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }, [cardData]);

  const handlePublishToCommunity = useCallback(() => {
    Toast.show({ content: '社区功能开发中，敬请期待', position: 'center' });
  }, []);

  const handleStampDone = useCallback(() => {
    setShowStampAnimation(false);
  }, []);

  // ====== Loading state ======
  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFF' }}>
        <NavBar onBack={() => navigate(-1)}>摆烂许可证</NavBar>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 45px)',
            color: '#999',
            fontSize: 14,
          }}
        >
          请先完成个人信息设置
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFF' }}>
        <NavBar onBack={() => navigate(-1)}>摆烂许可证</NavBar>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 45px)',
            color: '#999',
            fontSize: 14,
          }}
        >
          加载中...
        </div>
      </div>
    );
  }

  // ====== Render ======
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* NavBar */}
      <NavBar
        onBack={() => navigate(-1)}
        style={{
          '--height': '45px',
          backgroundColor: '#FFF',
          borderBottom: '1px solid #F0F0F0',
        } as React.CSSProperties}
      >
        摆烂许可证
      </NavBar>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 80, // Space for bottom button bar
        }}
      >
        {/* Card Preview */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 24,
            paddingBottom: 8,
          }}
        >
          <CardPreview
            cardData={cardData}
            showStampAnimation={showStampAnimation}
            onStampDone={handleStampDone}
            canvasRef={canvasRef}
          />
        </div>

        {/* Style Switcher */}
        <CardStyleSwitcher
          currentStyle={cardData.style}
          onStyleChange={handleStyleChange}
        />

        {/* Edit Section */}
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Nickname edit row */}
          <div
            onClick={() => setNicknameEditorVisible(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: '#F7F7F8',
              borderRadius: 12,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#666' }}>持证人</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>
                {cardData.nickname}
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                color: '#999',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &#9998;
            </span>
          </div>

          {/* Task Swapper */}
          <TaskSwapper
            currentTask={cardData.microTask}
            onSwap={handleTaskSwap}
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFF',
          borderTop: '1px solid #F0F0F0',
          padding: '12px 16px',
          display: 'flex',
          gap: 10,
          zIndex: 100,
        }}
      >
        <Button
          block
          color="primary"
          fill="outline"
          size="middle"
          onClick={handleSaveImage}
          style={{
            '--border-color': '#FF6B6B',
            '--text-color': '#FF6B6B',
            '--border-radius': '22px',
            fontSize: 14,
            fontWeight: 600,
          } as React.CSSProperties}
        >
          保存图片
        </Button>
        <Button
          block
          color="primary"
          fill="outline"
          size="middle"
          onClick={handleShareToFriend}
          style={{
            '--border-color': '#FF6B6B',
            '--text-color': '#FF6B6B',
            '--border-radius': '22px',
            fontSize: 14,
            fontWeight: 600,
          } as React.CSSProperties}
        >
          分享给朋友
        </Button>
        <Button
          block
          color="primary"
          fill="solid"
          size="middle"
          onClick={handlePublishToCommunity}
          style={{
            '--background-color': '#FF6B6B',
            '--border-color': '#FF6B6B',
            '--text-color': '#FFF',
            '--border-radius': '22px',
            fontSize: 14,
            fontWeight: 600,
          } as React.CSSProperties}
        >
          发布到社区
        </Button>
      </div>

      {/* SafeArea bottom spacer */}
      <SafeArea position="bottom" />

      {/* Nickname Editor Modal */}
      <NicknameEditor
        currentNickname={cardData.nickname}
        onConfirm={handleNicknameConfirm}
        visible={nicknameEditorVisible}
        onClose={() => setNicknameEditorVisible(false)}
      />
    </div>
  );
};

/** Fallback clipboard copy for environments without navigator.clipboard */
function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    Toast.show({ content: '文案已复制，快去分享吧', icon: 'success', position: 'center' });
  } catch {
    Toast.show({ content: '复制失败，请手动复制', position: 'center' });
  }
  document.body.removeChild(textarea);
}

export default CardGeneratorPage;
