/**
 * 绘制表格（诊断书风用）
 */
export function drawTable(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  rows: { label: string; value: number }[],
  headers: string[],
  _values: string[],
  lineColor: string,
  alertColor: string
): void {
  const colWidths = [width * 0.5, width * 0.5];
  const rowHeight = 44;
  const totalRows = 1 + rows.length; // 1 header + data rows

  ctx.save();

  // 表头背景
  ctx.fillStyle = '#F0F4F8';
  ctx.fillRect(x, y, width, rowHeight);

  // 表头文字
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#444444';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  headers.forEach((header, colIndex) => {
    const cellX = x + colWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0);
    ctx.fillText(header, cellX + colWidths[colIndex] / 2, y + rowHeight / 2);
  });

  // 数据行
  ctx.font = '15px sans-serif';

  rows.forEach((row, rowIndex) => {
    const rowY = y + (rowIndex + 1) * rowHeight;

    // 行背景（交替色）
    if (rowIndex % 2 === 0) {
      ctx.fillStyle = '#FAFBFC';
      ctx.fillRect(x, rowY, width, rowHeight);
    }

    // 标签
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelX = x + colWidths[0] / 2;
    ctx.fillText(row.label, labelX, rowY + rowHeight / 2);

    // 数值
    const valueX = x + colWidths[0] + colWidths[1] / 2;
    const isAlert = row.value < 30;
    ctx.fillStyle = isAlert ? alertColor : '#555555';
    if (isAlert) {
      ctx.font = 'bold 15px sans-serif';
    }
    ctx.fillText(`${row.value}%`, valueX, rowY + rowHeight / 2);
    if (isAlert) {
      ctx.font = '15px sans-serif';
    }
  });

  // 表格线条
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;

  // 水平线
  for (let i = 0; i <= totalRows; i++) {
    const lineY = y + i * rowHeight;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + width, lineY);
    ctx.stroke();
  }

  // 垂直线
  ctx.beginPath();
  ctx.moveTo(x + colWidths[0], y);
  ctx.lineTo(x + colWidths[0], y + totalRows * rowHeight);
  ctx.stroke();

  // 左右外框
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + totalRows * rowHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width, y + totalRows * rowHeight);
  ctx.stroke();

  ctx.restore();
}
