import { wrapText } from '../utils/text-layout';
import { FONT_SERIF, FONT_SANS } from '../utils/font-loader';

/**
 * 绘制居中标题（自动换行）
 */
export function drawTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: string
): number {
  ctx.save();
  ctx.font = `bold ${font}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const fontSize = parseInt(font) || 40;
  const lineHeight = fontSize * 1.6;
  const lines = wrapText(ctx, text, maxWidth, lineHeight);

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  ctx.restore();
  return y + lines.length * lineHeight;
}

/**
 * 绘制左对齐正文（自动换行）
 */
export function drawBodyText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: string
): number {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const fontSize = parseInt(font) || 20;
  const lineHeight = fontSize * 1.6;
  const lines = wrapText(ctx, text, maxWidth, lineHeight);

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  ctx.restore();
  return y + lines.length * lineHeight;
}

/**
 * 绘制居中金句（引号包裹）
 */
export function drawQuote(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: string
): number {
  ctx.save();
  ctx.font = `italic ${font}`;
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const quoteText = `\u201C${text}\u201D`;
  const fontSize = parseInt(font) || 24;
  const lineHeight = fontSize * 1.6;
  const lines = wrapText(ctx, quoteText, maxWidth, lineHeight);

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  ctx.restore();
  return y + lines.length * lineHeight;
}

/**
 * 绘制底部品牌落款 "—— 来自「今天也没废」"
 */
export function drawBrandFooter(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.font = `14px ${FONT_SANS}`;
  ctx.fillStyle = '#999999';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u2014\u2014 \u6765\u81EA\u300C\u4ECA\u5929\u4E5F\u6CA1\u5E9F\u300D', 375, 940);
  ctx.restore();
}
