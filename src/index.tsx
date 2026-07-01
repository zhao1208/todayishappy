import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
);
