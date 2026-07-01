import type { CardData } from '../types/card';

export interface CanvasSize {
  width: number;
  height: number;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  size: CanvasSize;
  cardData: CardData;
}

export const CANVAS_WIDTH = 750;
export const CANVAS_HEIGHT = 1000;
