import type { RenderContext } from '../types';
import { FONT_SERIF } from '../utils/font-loader';
import { drawBodyText } from '../elements/text';
import { drawQuote } from '../elements/text';
import { drawBrandFooter } from '../elements/text';
import { drawCircleStamp } from '../elements/stamp';
import { drawDoubleBorder } from '../elements/border';
import { drawDivider } from '../elements/border';
import { wrapText } from '../utils/text-layout';

/**
 * 公文风模板 - 渲染「今日摆烂许可证」
 */
export function renderOfficialCard(renderCtx: RenderContext): void {
  const { ctx, cardData } = renderCtx;
  const contentWidth = 710; // 750 - 2*20 padding
  const leftX = 40; // 20px padding + inner border offset
  const centerX = 375;

  // 1. 填充米白背景
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, 750, 1000);

  // 2. 绘制深棕细线双线边框（内距20px）
  drawDoubleBorder(ctx, 0, 0, 750, 1000, '#8B7B6B', 20);

  let curY = 60;

  // 3. 顶部居中标题
  ctx.save();
  ctx.font = `bold 40px ${FONT_SERIF}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const titleLines = wrapText(ctx, cardData.title, 620, 64);
  titleLines.forEach((line, i) => {
    ctx.fillText(line, centerX, curY + i * 64);
  });
  ctx.restore();
  curY += titleLines.length * 64 + 20;

  // 4. 编号
  ctx.save();
  ctx.font = `18px ${FONT_SERIF}`;
  ctx.fillStyle = '#999999';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`编号：${cardData.serialNo}`, centerX, curY);
  ctx.restore();
  curY += 36;

  // 5. 空一行后 持证人
  curY += 16;
  ctx.save();
  ctx.font = `22px ${FONT_SERIF}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`持证人：${cardData.nickname}`, leftX, curY);
  ctx.restore();
  curY += 44;

  // 6. 分隔线
  drawDivider(ctx, leftX, curY, contentWidth, '#C8BBA8');
  curY += 20;

  // 7. 左对齐 reasonText（20px，自动换行，最大宽度620px）
  curY = drawBodyText(ctx, cardData.reasonText, leftX, curY, 620, `20px ${FONT_SERIF}`);
  curY += 20;

  // 8. 分隔线
  drawDivider(ctx, leftX, curY, contentWidth, '#C8BBA8');
  curY += 20;

  // 9. 现批准
  curY = drawBodyText(ctx, `现批准：${cardData.permitText}`, leftX, curY, 620, `20px ${FONT_SERIF}`);
  curY += 20;

  // 10. 分隔线
  drawDivider(ctx, leftX, curY, contentWidth, '#C8BBA8');
  curY += 20;

  // 11. 但需完成最低行动：+ 高亮微任务
  ctx.save();
  ctx.font = `20px ${FONT_SERIF}`;
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('但需完成最低行动：', leftX, curY);
  ctx.restore();

  // 测量前缀文字宽度
  ctx.save();
  ctx.font = `20px ${FONT_SERIF}`;
  const prefixWidth = ctx.measureText('但需完成最低行动：').width;
  ctx.restore();

  // 高亮微任务
  ctx.save();
  ctx.font = `bold 20px ${FONT_SERIF}`;
  ctx.fillStyle = '#8B7B6B';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const microTaskText = `【${cardData.microTask}】`;
  const microTaskLines = wrapText(ctx, microTaskText, 620 - prefixWidth, 32);
  microTaskLines.forEach((line, i) => {
    ctx.fillText(line, leftX + prefixWidth, curY + i * 32);
  });
  ctx.restore();
  curY += Math.max(32, microTaskLines.length * 32) + 24;

  // 12. 空一行后居中金句
  curY += 8;
  drawQuote(ctx, cardData.goldenQuote, centerX, curY, 600, `24px ${FONT_SERIF}`);
  curY += 50;

  // 13. 红色圆形印章 "允许摆烂"
  drawCircleStamp(ctx, '允许摆烂', 620, 720, 50, '#C41E3A', -0.05);

  // 14. 品牌落款
  drawBrandFooter(ctx);
}
