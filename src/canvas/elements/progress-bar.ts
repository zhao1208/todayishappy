import { hexToRgba } from '../utils/color';

/**
 * 绘制圆角矩形路径
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * 绘制状态条（游戏风用）
 */
export function drawStatusBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  value: number,
  maxValue: number,
  label: string,
  color: string,
  bgColor: string
): void {
  const barX = x + 80;
  const barWidth = width - 140;
  const percentage = Math.max(0, Math.min(1, value / maxValue));
  const displayValue = Math.max(0, Math.round(percentage * 100));

  ctx.save();

  // 左侧标签
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#CCCCCC';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + height / 2);

  // 底色（圆角矩形）
  ctx.fillStyle = hexToRgba(bgColor, 0.6);
  roundRect(ctx, barX, y, barWidth, height, height / 2);
  ctx.fill();

  // 填充条
  if (percentage > 0) {
    const fillWidth = Math.max(height, barWidth * percentage); // 至少一个圆角宽度
    ctx.fillStyle = hexToRgba(color, 0.9);
    roundRect(ctx, barX, y, fillWidth, height, height / 2);
    ctx.fill();
  }

  // 右侧百分比文字
  ctx.font = 'bold 14px sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${displayValue}%`, barX + barWidth + 55, y + height / 2);

  ctx.restore();
}
