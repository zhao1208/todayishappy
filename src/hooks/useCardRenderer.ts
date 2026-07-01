import { useRef, useEffect, useCallback } from 'react';
import { renderCard } from '../canvas/renderer';
import type { CardData } from '../types/card';

const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 1000;
const DISPLAY_WIDTH = 375;
const DISPLAY_HEIGHT = 500;

export function useCardRenderer(
  cardData: CardData | null,
  forwardedRef?: React.RefObject<HTMLCanvasElement | null>
) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = forwardedRef ?? internalRef;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cardData) return;

    const dpr = window.devicePixelRatio || 2;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${DISPLAY_WIDTH}px`;
    canvas.style.height = `${DISPLAY_HEIGHT}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.scale(dpr, dpr);
    try {
      renderCard(ctx, cardData, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch (e) {
      console.error('Canvas render failed:', e);
    }
  }, [cardData, canvasRef]);

  useEffect(() => {
    const renderWithFonts = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // Font loading failed, proceed with fallback
      }
      render();
    };
    // Small delay to ensure canvas DOM is fully mounted
    const timer = setTimeout(renderWithFonts, 100);
    return () => clearTimeout(timer);
  }, [render]);

  return { canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>, render };
}
