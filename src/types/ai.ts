export type MessageStage = 'empathy' | 'mouthpiece' | 'microAction';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  stage?: MessageStage;
  createdAt: string;
}

export interface AIResponseTemplate {
  empathy: string;
  mouthpiece: string;
  microAction: string;
}

/** AI API 配置 */
export interface AIConfig {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: false,
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  temperature: 0.85,
  maxTokens: 800,
};
