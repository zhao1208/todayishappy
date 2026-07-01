import type { RenderContext } from '../types';
import { FONT_SANS } from '../utils/font-loader';
import { drawBodyText } from '../elements/text';
import { drawQuote } from '../elements/text';
import { drawBrandFooter } from '../elements/text';
import { drawTable } from '../elements/table';
import { drawDivider } from '../elements/border';
import { wrapText } from '../utils/text-layout';

/**
 * 诊断书风模板 - 渲染「今日精神诊断书」
 */
export function renderDiagnosisCard(renderCtx: RenderContext): void {
  const { ctx, cardData } = renderCtx;
  const centerX = 375;
  const leftX = 60;
  const contentWidth = 630;

  // 1. 纯白背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 750, 1000);

  // 2. 顶部居中标题
  ctx.save();
  ctx.font = `bold 36px ${FONT_SANS}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const titleLines = wrapText(ctx, cardData.title, 600, 58);
  titleLines.forEach((line, i) => {
    ctx.fillText(line, centerX, 50 + i * 58);
  });
  ctx.restore();

  let curY = 50 + titleLines.length * 58 + 16;

  // 3. 居中编号
  ctx.save();
  ctx.font = `16px ${FONT_SANS}`;
  ctx.fillStyle = '#999999';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`编号：${cardData.serialNo}`, centerX, curY);
  ctx.restore();
  curY += 36;

  // 4. 数据表格
  const tableRows = [
    { label: '精神电量', value: Math.floor(Math.random() * 13) + 13 },
    { label: '行动力', value: Math.floor(Math.random() * 11) + 15 },
    { label: '内耗指数', value: Math.floor(Math.random() * 16) + 80 },
    { label: '社交意愿', value: Math.floor(Math.random() * 7) + 2 },
    { label: 'DDL压力', value: Math.floor(Math.random() * 14) + 85 },
  ];

  drawTable(
    ctx,
    60,
    180,
    630,
    tableRows,
    ['检测项目', '当前数值'],
    [],
    '#B0C4DE',
    '#E74C3C'
  );

  curY = 180 + (1 + tableRows.length) * 44 + 24;

  // 5. 分隔线
  drawDivider(ctx, leftX, curY, contentWidth, '#D0D5DD');
  curY += 20;

  // 6. 诊断结论
  curY = drawBodyText(ctx, `诊断结论：${cardData.reasonText}`, leftX, curY, 600, `18px ${FONT_SANS}`);
  curY += 16;

  // 7. 分隔线
  drawDivider(ctx, leftX, curY, contentWidth, '#D0D5DD');
  curY += 20;

  // 8. 建议治疗
  ctx.save();
  ctx.font = `18px ${FONT_SANS}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('建议治疗：', leftX, curY);
  ctx.restore();

  // 测量前缀宽度
  ctx.save();
  ctx.font = `18px ${FONT_SANS}`;
  const diagPrefixWidth = ctx.measureText('建议治疗：').width;
  ctx.restore();

  // 高亮微任务
  ctx.save();
  ctx.font = `bold 18px ${FONT_SANS}`;
  ctx.fillStyle = '#2C3E50';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const diagMicroText = `【${cardData.microTask}】`;
  const diagMicroLines = wrapText(ctx, diagMicroText, 600 - diagPrefixWidth, 29);
  diagMicroLines.forEach((line, i) => {
    ctx.fillText(line, leftX + diagPrefixWidth, curY + i * 29);
  });
  ctx.restore();
  curY += Math.max(29, diagMicroLines.length * 29) + 24;

  // 9. 空行后居中金句
  curY += 8;
  drawQuote(ctx, cardData.goldenQuote, centerX, curY, 580, `22px ${FONT_SANS}`);
  curY += 50;

  // 10. 蓝色圆角矩形徽章 "已诊断"
  ctx.save();
  const badgeX = 600;
  const badgeY = 700;
  const badgeW = 90;
  const badgeH = 36;
  const badgeR = 8;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#2C3E50';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(badgeX + badgeR, badgeY);
  ctx.lineTo(badgeX + badgeW - badgeR, badgeY);
  ctx.arcTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + badgeR, badgeR);
  ctx.lineTo(badgeX + badgeW, badgeY + badgeH - badgeR);
  ctx.arcTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - badgeR, badgeY + badgeH, badgeR);
  ctx.lineTo(badgeX + badgeR, badgeY + badgeH);
  ctx.arcTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - badgeR, badgeR);
  ctx.lineTo(badgeX, badgeY + badgeR);
  ctx.arcTo(badgeX, badgeY, badgeX + badgeR, badgeY, badgeR);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.font = `bold 16px ${FONT_SANS}`;
  ctx.fillStyle = '#2C3E50';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('已诊断', badgeX + badgeW / 2, badgeY + badgeH / 2);
  ctx.restore();

  // 11. 品牌落款
  drawBrandFooter(ctx);
}
