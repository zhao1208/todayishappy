import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Input, Button, Toast } from 'antd-mobile';
import { useUserStore } from '../store/UserContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoggedIn } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → go home
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({ content: '请填写完整信息', position: 'center' });
      return;
    }
    setLoading(true);
    const result = register(username.trim(), password, confirmPassword);
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
      <NavBar onBack={() => navigate(-1)}>注册</NavBar>

      <div style={{ padding: '32px 24px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#FF6B6B' }}>
            今天也没废
          </div>
          <div style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            注册一个账号，记录你的每一天
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>用户名</label>
            <Input
              placeholder="至少3个字符"
              value={username}
              onChange={setUsername}
              style={{ '--font-size': '15px' } as React.CSSProperties}
            />
          </div>

          <div>
            <label style={labelStyle}>密码</label>
            <Input
              placeholder="至少6个字符"
              type="password"
              value={password}
              onChange={setPassword}
              style={{ '--font-size': '15px' } as React.CSSProperties}
            />
          </div>

          <div>
            <label style={labelStyle}>确认密码</label>
            <Input
              placeholder="再次输入密码"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              style={{ '--font-size': '15px' } as React.CSSProperties}
            />
          </div>

          <Button
            block
            color="primary"
            loading={loading}
            onClick={handleRegister}
            style={{
              '--background-color': '#FF6B6B',
              '--border-radius': '24px',
              fontSize: 16,
              fontWeight: 600,
              marginTop: 12,
            } as React.CSSProperties}
          >
            注册
          </Button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#666' }}>
              已有账号？
            </span>
            <span
              onClick={() => navigate('/login')}
              style={{
                fontSize: 14,
                color: '#FF6B6B',
                fontWeight: 600,
                marginLeft: 4,
                cursor: 'pointer',
              }}
            >
              去登录
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

export default RegisterPage;
