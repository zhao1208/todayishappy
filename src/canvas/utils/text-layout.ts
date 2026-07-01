export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight?: number
): string[] {
  const lines: string[] = [];
  let currentLine = '';
  const lh = lineHeight || parseInt(ctx.font) * 1.6;

  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function measureTextHeight(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): number {
  const lines = wrapText(ctx, text, maxWidth);
  const fontSize = parseInt(ctx.font) || 16;
  return lines.length * fontSize * 1.6;
}
