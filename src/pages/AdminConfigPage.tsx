import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Switch, Input, Button, Toast, Card, Slider } from 'antd-mobile';
import { useAIConfig } from '../hooks/useAIConfig';

const PRESET_PROVIDERS = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { name: 'SiliconFlow', baseUrl: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3' },
  { name: '阿里云百炼', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { name: '自定义', baseUrl: '', model: '' },
];

const AdminConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const { config, isValid, updateConfig, resetConfig } = useAIConfig();
  const [testLoading, setTestLoading] = useState(false);

  const handleProviderSelect = useCallback((provider: typeof PRESET_PROVIDERS[0]) => {
    updateConfig({
      baseUrl: provider.baseUrl,
      model: provider.model,
    });
  }, [updateConfig]);

  const handleTest = useCallback(async () => {
    if (!config.enabled) {
      Toast.show({ content: '请先打开右上角「启用真实 AI 回复」开关', position: 'center' });
      return;
    }
    if (!isValid) {
      Toast.show({ content: '请填写完整的 API 信息（Base URL / API Key / 模型名称）', position: 'center' });
      return;
    }
    setTestLoading(true);
    try {
      const response = await fetch(
        `${config.baseUrl.replace(/\/$/, '')}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: 'system', content: '你是一个简短的AI助手，只回复"测试成功"四个字。' },
              { role: 'user', content: '测试' },
            ],
            max_tokens: 20,
          }),
        },
      );
      if (!response.ok) {
        const err = await response.text().catch(() => response.statusText);
        Toast.show({ content: `测试失败: ${err}`, position: 'center' });
        return;
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      Toast.show({
        content: content ? `测试成功: ${content}` : '测试成功',
        icon: 'success',
        position: 'center',
      });
    } catch (e: any) {
      Toast.show({ content: `测试失败: ${e.message}`, position: 'center' });
    } finally {
      setTestLoading(false);
    }
  }, [config, isValid]);

  const statusLabel = config.enabled
    ? isValid
      ? '已启用（配置有效）'
      : '已启用（配置不完整）'
    : '已禁用（使用本地模板）';

  const statusColor = config.enabled
    ? isValid
      ? '#52C41A'
      : '#FAAD14'
    : '#999';

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F8' }}>
      <NavBar onBack={() => navigate(-1)}>AI 配置</NavBar>

      <div style={{ padding: '12px 16px 32px' }}>
        {/* 状态卡片 */}
        <Card
          style={{
            marginBottom: 16,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 0',
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                启用真实 AI 回复
              </div>
              <div style={{ fontSize: 12, color: statusColor, marginTop: 4 }}>
                {statusLabel}
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onChange={(checked) => updateConfig({ enabled: checked })}
            />
          </div>
        </Card>

        {/* 服务商预设 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#666', marginBottom: 10 }}>
            快速选择服务商
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESET_PROVIDERS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleProviderSelect(p)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: '1px solid #E0E0E0',
                  background: config.baseUrl === p.baseUrl ? '#FF6B6B' : '#fff',
                  color: config.baseUrl === p.baseUrl ? '#fff' : '#333',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 配置表单 */}
        <Card style={{ borderRadius: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>API Base URL</label>
              <Input
                placeholder="https://api.openai.com/v1"
                value={config.baseUrl}
                onChange={(v) => updateConfig({ baseUrl: v })}
                style={{ '--font-size': '14px' } as React.CSSProperties}
              />
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                大多数服务商都兼容 OpenAI 格式，填到 /v1 为止
              </div>
            </div>

            <div>
              <label style={labelStyle}>API Key</label>
              <Input
                placeholder="sk-..."
                type="password"
                value={config.apiKey}
                onChange={(v) => updateConfig({ apiKey: v })}
                style={{ '--font-size': '14px' } as React.CSSProperties}
              />
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                密钥仅存储在本地浏览器，不会上传到任何服务器
              </div>
            </div>

            <div>
              <label style={labelStyle}>模型名称</label>
              <Input
                placeholder="gpt-4o-mini"
                value={config.model}
                onChange={(v) => updateConfig({ model: v })}
                style={{ '--font-size': '14px' } as React.CSSProperties}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Temperature: {config.temperature}
              </label>
              <Slider
                min={0}
                max={2}
                step={0.05}
                value={config.temperature}
                onChange={(v) => updateConfig({ temperature: v as number })}
                style={{ '--fill-color': '#FF6B6B' } as React.CSSProperties}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bbb' }}>
                <span>保守 0</span>
                <span>平衡 1</span>
                <span>创意 2</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Max Tokens: {config.maxTokens}
              </label>
              <Slider
                min={100}
                max={4000}
                step={50}
                value={config.maxTokens}
                onChange={(v) => updateConfig({ maxTokens: v as number })}
                style={{ '--fill-color': '#FF6B6B' } as React.CSSProperties}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bbb' }}>
                <span>短 100</span>
                <span>中等 800</span>
                <span>长 4000</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button
            block
            color="primary"
            loading={testLoading}
            onClick={handleTest}
          >
            测试连接
          </Button>
          <Button
            block
            fill="outline"
            color="danger"
            onClick={() => {
              resetConfig();
              Toast.show({ content: '已重置为默认配置', position: 'center' });
            }}
          >
            重置默认配置
          </Button>
        </div>

        {/* 说明 */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: '#FFF7E6',
            borderRadius: 12,
            fontSize: 12,
            color: '#666',
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: '#FA8C16' }}>使用说明</strong>
          <p style={{ margin: '4px 0 0' }}>
            1. 配置完成后点击"测试连接"验证 API 是否可用
          </p>
          <p style={{ margin: '4px 0 0' }}>
            2. 所有配置仅保存在你的浏览器本地（localStorage），不会上传到任何服务器
          </p>
          <p style={{ margin: '4px 0 0' }}>
            3. 如果未配置或 API 不可用，将自动回退到本地模板回复
          </p>
          <p style={{ margin: '4px 0 0' }}>
            4. 支持所有 OpenAI 兼容格式的 API（DeepSeek / SiliconFlow / 阿里云百炼 / OpenAI 等）
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#333',
  marginBottom: 6,
};

export default AdminConfigPage;
