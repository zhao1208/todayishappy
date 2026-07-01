import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SafeArea } from 'antd-mobile';
import AppTabBar from './AppTabBar';

interface AppLayoutProps {
  children: React.ReactNode;
  showTabBar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showTabBar = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  return (
    <div style={{ paddingBottom: showTabBar ? '50px' : 0 }}>
      {children}
      {showTabBar && <AppTabBar activeTab={activeTab} onTabChange={handleTabChange} />}
      <SafeArea position="bottom" />
    </div>
  );
};

export default AppLayout;
