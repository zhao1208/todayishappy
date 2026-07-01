import React from 'react';
import { useCardRenderer } from '../../hooks/useCardRenderer';
import type { CardData } from '../../types/card';

interface CertificateCanvasProps {
  cardData: CardData;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const CertificateCanvas: React.FC<CertificateCanvasProps> = ({ cardData, canvasRef: forwardedRef }) => {
  const { canvasRef: internalRef } = useCardRenderer(cardData);

  const canvasRef = forwardedRef || internalRef;

  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      style={{
        display: 'block',
        width: 375,
        height: 500,
        borderRadius: 8,
      }}
    />
  );
};

export default CertificateCanvas;
