import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../types';

export function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 2;
  canvas.width = CANVAS_WIDTH * dpr;
  canvas.height = CANVAS_HEIGHT * dpr;
  canvas.style.width = `${CANVAS_WIDTH / 2}px`;
  canvas.style.height = `${CANVAS_HEIGHT / 2}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return ctx;
}

export function getDisplaySize() {
  return { width: CANVAS_WIDTH / 2, height: CANVAS_HEIGHT / 2 };
}
