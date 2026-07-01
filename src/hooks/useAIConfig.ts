import { useState, useCallback, useEffect } from 'react';
import type { AIConfig } from '../types/ai';
import { DEFAULT_AI_CONFIG } from '../types/ai';

const STORAGE_KEY = 'tnw_ai_config';

/** 读取本地 AI 配置 */
function loadConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AI_CONFIG, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_AI_CONFIG };
}

/** 保存 AI 配置 */
function saveConfig(config: AIConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function useAIConfig() {
  const [config, setConfigState] = useState<AIConfig>(loadConfig);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid =
      config.enabled &&
      config.apiKey.trim().length > 0 &&
      config.baseUrl.trim().length > 0 &&
      config.model.trim().length > 0;
    setIsValid(valid);
  }, [config]);

  const updateConfig = useCallback((partial: Partial<AIConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...partial };
      saveConfig(next);
      return next;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState({ ...DEFAULT_AI_CONFIG });
    saveConfig({ ...DEFAULT_AI_CONFIG });
  }, []);

  return { config, isValid, updateConfig, resetConfig };
}
