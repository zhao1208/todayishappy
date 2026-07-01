import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Input, Button, Toast } from 'antd-mobile';
import { useUserStore } from '../store/UserContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → go home
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Toast.show({ content: '请填写用户名和密码', position: 'center' });
      return;
    }
    setLoading(true);
    const result = login(username.trim(), password);
    setLoading(false);
    if (result.success) {
      Toast.show({ content: result.message, icon: 'success', position: 'center' });
      navigate('/', { replace: true });
    } else {
      Toast.show({ content: result.message, position: 'center' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F8' }}>
      <NavBar onBack={() => navigate(-1)}>登录</NavBar>

      <div style={{ padding: '32px 24px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FF6B6B' }}>
            今天也没废
          </div>
          <div style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            登录后继续你的摆烂之旅
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>用户名</label>
            <Input
              placeholder="请输入用户名"
              value={username}
              onChange={setUsername}
              style={{ '--font-size': '15px' } as React.CSSProperties}
            />
          </div>

          <div>
            <label style={labelStyle}>密码</label>
            <Input
              placeholder="请输入密码"
              type="password"
              value={password}
              onChange={setPassword}
              style={{ '--font-size': '15px' } as React.CSSProperties}
            />
          </div>

          <Button
            block
            color="primary"
            loading={loading}
            onClick={handleLogin}
            style={{
              '--background-color': '#FF6B6B',
              '--border-radius': '24px',
              fontSize: 16,
              fontWeight: 600,
              marginTop: 12,
            } as React.CSSProperties}
          >
            登录
          </Button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#666' }}>
              还没有账号？
            </span>
            <span
              onClick={() => navigate('/register')}
              style={{
                fontSize: 14,
                color: '#FF6B6B',
                fontWeight: 600,
                marginLeft: 4,
                cursor: 'pointer',
              }}
            >
              立即注册
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  color: '#333',
  marginBottom: 8,
};

export default LoginPage;
