import type { CardData } from '../types/card';
import type { RenderContext } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './types';
import { renderOfficialCard } from './templates/official';
import { renderDiagnosisCard } from './templates/diagnosis';
import { renderGameCard } from './templates/game';

export function renderCard(
  ctx: CanvasRenderingContext2D,
  cardData: CardData,
  width: number = CANVAS_WIDTH,
  height: number = CANVAS_HEIGHT
): void {
  const renderCtx: RenderContext = {
    ctx,
    size: { width, height },
    cardData,
  };

  switch (cardData.style) {
    case 'official':
      renderOfficialCard(renderCtx);
      break;
    case 'diagnosis':
      renderDiagnosisCard(renderCtx);
      break;
    case 'game':
      renderGameCard(renderCtx);
      break;
    default:
      renderOfficialCard(renderCtx);
  }
}
