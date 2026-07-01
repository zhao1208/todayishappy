import React from 'react';
import { TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';

interface AppTabBarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

const tabs = [
  { key: '/', title: '首页', icon: <AppOutline /> },
  { key: '/community', title: '社区', icon: <UnorderedListOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
];

const AppTabBar: React.FC<AppTabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
      <TabBar activeKey={activeTab} onChange={onTabChange}>
        {tabs.map((tab) => (
          <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
        ))}
      </TabBar>
    </div>
  );
};

export default AppTabBar;
