import React, { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const CardGeneratorPage = lazy(() => import('../pages/CardGeneratorPage'));
const AIChatPage = lazy(() => import('../pages/AIChatPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const FriendVerifyPage = lazy(() => import('../pages/FriendVerifyPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminConfigPage = lazy(() => import('../pages/AdminConfigPage'));

export const routes: RouteObject[] = [
  { path: '/onboarding', element: <Suspense fallback={<div>加载中...</div>}><OnboardingPage /></Suspense> },
  { path: '/', element: <Suspense fallback={<div>加载中...</div>}><HomePage /></Suspense> },
  { path: '/card/generate', element: <Suspense fallback={<div>加载中...</div>}><CardGeneratorPage /></Suspense> },
  { path: '/ai-chat', element: <Suspense fallback={<div>加载中...</div>}><AIChatPage /></Suspense> },
  { path: '/community', element: <Suspense fallback={<div>加载中...</div>}><CommunityPage /></Suspense> },
  { path: '/friend-verify', element: <Suspense fallback={<div>加载中...</div>}><FriendVerifyPage /></Suspense> },
  { path: '/profile', element: <Suspense fallback={<div>加载中...</div>}><ProfilePage /></Suspense> },
  { path: '/admin/config', element: <Suspense fallback={<div>加载中...</div>}><AdminConfigPage /></Suspense> },
];
