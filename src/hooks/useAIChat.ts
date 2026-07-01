import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, AIResponseTemplate, AIConfig } from '../types/ai';
import { getAIResponse, getFallbackResponse } from '../data/ai-responses';
import type { UserMode } from '../types/user';
import { useAIConfig } from './useAIConfig';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/** 品牌系统提示词 —— 约束 AI 输出风格 */
function buildSystemPrompt(statusName: string | null, mode: UserMode): string {
  const modeLabel = mode === 'student' ? '学生' : '上班族';
  const statusHint = statusName ? `用户当前状态是「${statusName}」，请结合这个状态来回复。` : '';

  return `你是「今天也没废」的AI摆烂搭子，一个理解${modeLabel}情绪、用幽默化解焦虑的陪伴型AI。你的语气轻松、温暖、不煽情，像是一个真正懂你的朋友。

${statusHint}

## 品牌语言规范（必须严格遵守）
- 【禁用词汇】绝对不能说：加油、你一定可以、相信自己、努力、奋斗、拼搏、你看看别人、别人都能做到、这有什么难的、有什么大不了的
- 【推荐词汇】优先使用：允许、批准、今天算了、明天再说、抱一下、我也这样、你不是一个人、低电量、缓冲中、加载中、保护模式、烂中带救、轻轻爬起来、别彻底掉线
- 【禁止说教】不能说"你应该..."，禁止一切建议性说教
- 【禁止打鸡血】不能说"加油你一定可以的！"
- 【禁止否定感受】不能说"这有什么大不了的"
- 【语气要求】用"摆烂语言体系"回应：允许用户摆烂，但永远留一个"微行动"的钩子。共情不说教，幽默不轻浮，低能量不低气压

## 回复格式（三段式，必须严格用以下标记分割）
你的每次回复都必须包含三个部分，用标记开头，不要有多余的引言或总结：

[共情] 第一步：接住用户的情绪，真诚表达理解。用温暖但不煽情的语言让用户感到"被看见"。不要给建议，只说"我懂你"。

[嘴替] 第二步：把用户的处境用幽默、自嘲、共鸣的方式表达出来，让用户会心一笑。可以用夸张、比喻、一本正经搞笑的方式。这是你最自由发挥的部分。

[微行动] 第三步：给出一个极低门槛的行动建议，让用户可以轻松完成。用"现在不需要做任何大事，只做一件小事"的语气。建议必须具体、小到可笑，比如"打开文档写个标题""接一杯水""站起来伸个懒腰"。

## 输出要求
- 每段不要太长，2-4句话即可
- 三段式标记 [共情] [嘴替] [微行动] 必须严格保留，不要省略
- 整体回复不超过200字`;
}

/** 解析 AI 返回的文本，按标记切分为三段 */
function parseThreeStage(text: string): AIResponseTemplate {
  const empathyMatch = text.match(/\[共情\]\s*([\s\S]*?)(?=\[嘴替\]|$)/);
  const mouthpieceMatch = text.match(/\[嘴替\]\s*([\s\S]*?)(?=\[微行动\]|$)/);
  const microActionMatch = text.match(/\[微行动\]\s*([\s\S]*)/);

  const empathy = empathyMatch ? empathyMatch[1].trim() : '';
  const mouthpiece = mouthpieceMatch ? mouthpieceMatch[1].trim() : '';
  const microAction = microActionMatch ? microActionMatch[1].trim() : '';

  // 如果解析失败，把整个文本作为嘴替
  if (!empathy && !mouthpiece && !microAction) {
    return { empathy: '我听到你了。你的感受是真实的，值得被认真对待。', mouthpiece: text.trim(), microAction: '试试深呼吸三次，感受空气慢慢进入身体。' };
  }

  return {
    empathy: empathy || '我听到你了，你的感受是真实的。',
    mouthpiece: mouthpiece || '有时候生活就是这样，我们都不容易。',
    microAction: microAction || '试着做一件让自己舒服的小事吧。',
  };
}

/** 调用真实 AI API */
async function callRealAI(
  config: AIConfig,
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${errText || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI 返回内容为空');
  }
  return content;
}

export function useAIChat(currentStatusId: string, mode: UserMode, statusName: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responseIndexRef = useRef(0);
  const { config: aiConfig, isValid: hasAIConfig } = useAIConfig();

  /** 模板匹配回退 */
  const fallbackTemplate = useCallback(
    (userText: string): AIResponseTemplate => {
      const response = getAIResponse(currentStatusId, userText) || getFallbackResponse();
      responseIndexRef.current++;
      return response;
    },
    [currentStatusId],
  );

  const send = useCallback(
    async (userText: string) => {
      setError(null);
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: userText,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      let template: AIResponseTemplate;

      // 尝试调用真实 API
      if (hasAIConfig && aiConfig.enabled) {
        try {
          // 构建历史消息（最多保留最近 6 条）
          const historyMessages = messages.slice(-6).map(m => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content,
          }));

          const apiMessages = [
            { role: 'system', content: buildSystemPrompt(statusName, mode) },
            ...historyMessages,
            { role: 'user', content: userText },
          ];

          const rawText = await callRealAI(aiConfig, apiMessages);
          template = parseThreeStage(rawText);
        } catch (e: any) {
          console.warn('AI API 调用失败，回退到模板:', e);
          setError(`AI 服务暂时不可用，已切换为本地模式 (${e.message})`);
          template = fallbackTemplate(userText);
        }
      } else {
        // 模拟延迟后使用模板
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
        template = fallbackTemplate(userText);
      }

      // 三段式输出，每段间隔 500ms
      const stages: Array<{ content: string; stage: 'empathy' | 'mouthpiece' | 'microAction' }> = [
        { content: template.empathy, stage: 'empathy' },
        { content: template.mouthpiece, stage: 'mouthpiece' },
        { content: template.microAction, stage: 'microAction' },
      ];

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const aiMsg: ChatMessage = {
          id: generateId(),
          role: 'ai',
          content: stage.content,
          stage: stage.stage,
          createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);
      }

      setIsTyping(false);
    },
    [messages, hasAIConfig, aiConfig, statusName, mode, fallbackTemplate],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    responseIndexRef.current = 0;
  }, []);

  return { messages, isTyping, error, send, clearChat };
}
