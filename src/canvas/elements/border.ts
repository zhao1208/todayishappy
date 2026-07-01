/**
 * 绘制双线边框
 */
export function drawDoubleBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  padding: number
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // 外框
  ctx.strokeRect(x, y, width, height);

  // 内框
  ctx.strokeRect(x + padding, y + padding, width - padding * 2, height - padding * 2);

  ctx.restore();
}

/**
 * 绘制单线边框
 */
export function drawSingleBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  padding: number
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + padding, y + padding, width - padding * 2, height - padding * 2);
  ctx.restore();
}

/**
 * 绘制水平分隔线
 */
export function drawDivider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.restore();
}
