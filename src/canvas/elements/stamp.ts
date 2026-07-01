import { hexToRgba } from '../utils/color';

/**
 * 绘制圆形印章
 */
export function drawCircleStamp(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  radius: number,
  color: string,
  rotation: number = -0.05
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // 半透明填充（模拟印泥效果）
  ctx.fillStyle = hexToRgba(color, 0.08);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // 外圆（实线）
  ctx.strokeStyle = hexToRgba(color, 0.85);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 内圆（虚线）
  ctx.strokeStyle = hexToRgba(color, 0.6);
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, radius - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 中心文字
  ctx.fillStyle = hexToRgba(color, 0.9);
  ctx.font = `bold ${Math.floor(radius * 0.42)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}
