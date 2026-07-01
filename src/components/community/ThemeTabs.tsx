import React from 'react';
import { Tabs } from 'antd-mobile';
import type { CommunityTheme } from '../../types/community';

interface ThemeTabsProps {
  themes: CommunityTheme[];
  activeTheme: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeTabs: React.FC<ThemeTabsProps> = ({ themes, activeTheme, onThemeChange }) => {
  return (
    <Tabs
      activeKey={activeTheme}
      onChange={(key) => onThemeChange(key)}
      style={{
        '--title-font-size': '13px',
        '--active-line-height': '2px',
      } as React.CSSProperties}
    >
      {themes.map((theme) => (
        <Tabs.Tab key={theme.id} title={`${theme.icon} ${theme.name}`} />
      ))}
    </Tabs>
  );
};

export default ThemeTabs;
