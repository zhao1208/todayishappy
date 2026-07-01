/**
 * 事件上报工具
 * MVP 阶段仅做 console.log，后续可替换为真实上报 SDK
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>
): void {
  if (params && Object.keys(params).length > 0) {
    console.log(`[Analytics] ${eventName}`, params);
  } else {
    console.log(`[Analytics] ${eventName}`);
  }
}
