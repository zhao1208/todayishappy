import type { RenderContext } from '../types';
import { FONT_SANS } from '../utils/font-loader';
import { drawQuote } from '../elements/text';
import { drawBrandFooter } from '../elements/text';
import { drawStatusBar } from '../elements/progress-bar';
import { drawDivider } from '../elements/border';
import { wrapText } from '../utils/text-layout';
import { hexToRgba } from '../utils/color';

/**
 * 游戏状态面板风模板 - 渲染「今日角色状态面板」
 */
export function renderGameCard(renderCtx: RenderContext): void {
  const { ctx, cardData } = renderCtx;
  const centerX = 375;
  const leftX = 60;
  const contentWidth = 630;

  // 1. 深蓝黑背景
  ctx.fillStyle = '#1A1A2E';
  ctx.fillRect(0, 0, 750, 1000);

  let curY = 60;

  // 2. 顶部居中职业名称框（霓虹青发光效果）
  ctx.save();

  // 发光外框
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#00D2FF';
  ctx.strokeStyle = '#00D2FF';
  ctx.lineWidth = 2;
  const jobBoxX = leftX;
  const jobBoxW = contentWidth;
  const jobBoxH = 56;
  const jobBoxR = 8;

  ctx.beginPath();
  ctx.moveTo(jobBoxX + jobBoxR, curY);
  ctx.lineTo(jobBoxX + jobBoxW - jobBoxR, curY);
  ctx.arcTo(jobBoxX + jobBoxW, curY, jobBoxX + jobBoxW, curY + jobBoxR, jobBoxR);
  ctx.lineTo(jobBoxX + jobBoxW, curY + jobBoxH - jobBoxR);
  ctx.arcTo(jobBoxX + jobBoxW, curY + jobBoxH, jobBoxX + jobBoxW - jobBoxR, curY + jobBoxH, jobBoxR);
  ctx.lineTo(jobBoxX + jobBoxR, curY + jobBoxH);
  ctx.arcTo(jobBoxX, curY + jobBoxH, jobBoxX, curY + jobBoxH - jobBoxR, jobBoxR);
  ctx.lineTo(jobBoxX, curY + jobBoxR);
  ctx.arcTo(jobBoxX, curY, jobBoxX + jobBoxR, curY, jobBoxR);
  ctx.closePath();
  ctx.stroke();

  // 文字也带发光
  ctx.font = `bold 36px ${FONT_SANS}`;
  ctx.fillStyle = '#00D2FF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00D2FF';
  ctx.fillText(`当前职业：${cardData.nickname}`, centerX, curY + jobBoxH / 2);

  ctx.restore();
  curY += jobBoxH + 50;

  // 3. 四条状态条
  const hp = Math.floor(Math.random() * 21) + 30;     // 30-50
  const spirit = Math.floor(Math.random() * 11) + 5;   // 5-15
  const action = Math.floor(Math.random() * 11) - 5;    // -5 to 5
  const overthink = Math.floor(Math.random() * 11) + 85; // 85-95

  // 生命值
  drawStatusBar(ctx, leftX, curY, contentWidth, 20, hp, 100, '生命值', '#4CAF50', '#333333');
  curY += 80;

  // 精神值
  drawStatusBar(ctx, leftX, curY, contentWidth, 20, spirit, 100, '精神值', '#2196F3', '#333333');
  curY += 80;

  // 行动力（特殊处理负值）
  const actionDisplay = Math.max(0, action);
  drawStatusBar(ctx, leftX, curY, contentWidth, 20, actionDisplay, 100, '行动力', '#FF9800', '#333333');
  if (action < 0) {
    ctx.save();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#FF4444';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${action}%`, leftX + contentWidth - 40, curY + 10);
    ctx.restore();
  }
  curY += 80;

  // 内耗值
  drawStatusBar(ctx, leftX, curY, contentWidth, 20, overthink, 100, '内耗值', '#F44336', '#333333');
  curY += 60;

  // 4. 【DEBUFF】区块
  ctx.save();
  ctx.font = `bold 20px ${FONT_SANS}`;
  ctx.fillStyle = '#FF6B9D';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#FF6B9D';
  ctx.fillText('【DEBUFF】', leftX, curY);
  ctx.restore();
  curY += 32;

  // 生成2-3个debuff标签
  const debuffs = generateDebuffs(hp, spirit, action, overthink);
  let tagX = leftX;
  debuffs.forEach((debuff) => {
    ctx.save();
    ctx.font = `14px ${FONT_SANS}`;
    const tagWidth = ctx.measureText(debuff).width + 24;

    // 标签背景
    ctx.fillStyle = hexToRgba('#FF6B9D', 0.15);
    roundRectPath(ctx, tagX, curY, tagWidth, 28, 6);
    ctx.fill();

    // 标签文字
    ctx.fillStyle = '#FF6B9D';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(debuff, tagX + tagWidth / 2, curY + 14);

    ctx.restore();
    tagX += tagWidth + 12;
  });
  curY += 48;

  // 5. 【今日BUFF】区块
  ctx.save();
  ctx.font = `bold 20px ${FONT_SANS}`;
  ctx.fillStyle = '#00D2FF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#00D2FF';
  ctx.fillText('【今日BUFF】', leftX, curY);
  ctx.restore();
  curY += 32;

  ctx.save();
  ctx.font = `16px ${FONT_SANS}`;
  ctx.fillStyle = '#00D2FF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 4;
  ctx.shadowColor = '#00D2FF';
  const buffLines = wrapText(ctx, cardData.permitText, contentWidth - 20, 26);
  buffLines.forEach((line, i) => {
    ctx.fillText(line, leftX + 8, curY + i * 26);
  });
  ctx.restore();
  curY += Math.max(26, buffLines.length * 26) + 20;

  // 6. 【主线任务】区块
  ctx.save();
  ctx.font = `bold 20px ${FONT_SANS}`;
  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#FFD700';
  ctx.fillText('【主线任务】', leftX, curY);
  ctx.restore();
  curY += 32;

  // 高亮框
  ctx.save();
  ctx.font = `bold 18px ${FONT_SANS}`;
  const taskLines = wrapText(ctx, cardData.microTask, contentWidth - 40, 30);
  const taskBoxH = taskLines.length * 30 + 16;

  ctx.fillStyle = hexToRgba('#FFD700', 0.1);
  ctx.strokeStyle = hexToRgba('#FFD700', 0.5);
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, leftX + 4, curY, contentWidth - 8, taskBoxH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFD700';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  taskLines.forEach((line, i) => {
    ctx.fillText(line, leftX + 16, curY + 8 + i * 30);
  });
  ctx.restore();
  curY += taskBoxH + 24;

  // 7. 金句（带微弱发光效果）
  ctx.save();
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#FFFFFF';
  drawQuote(ctx, cardData.goldenQuote, centerX, curY, 560, `20px ${FONT_SANS}`);
  ctx.restore();
  curY += 50;

  // 8. 品牌落款（浅色）
  ctx.save();
  ctx.font = `14px ${FONT_SANS}`;
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u2014\u2014 \u6765\u81EA\u300C\u4ECA\u5929\u4E5F\u6CA1\u5E9F\u300D', centerX, 940);
  ctx.restore();
}

/**
 * 圆角矩形路径
 */
function roundRectPath(
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
 * 根据状态值生成debuff标签
 */
function generateDebuffs(
  hp: number,
  spirit: number,
  action: number,
  overthink: number
): string[] {
  const debuffs: string[] = [];

  if (spirit < 20) debuffs.push('精神涣散');
  if (overthink > 85) debuffs.push('内耗过载');
  if (action <= 0) debuffs.push('行动瘫痪');
  if (hp < 40) debuffs.push('体力透支');

  // 至少保证2个
  if (debuffs.length < 2) {
    debuffs.push('摸鱼冲动');
  }
  if (debuffs.length < 2) {
    debuffs.push('拖延症发作');
  }

  return debuffs.slice(0, 3);
}
