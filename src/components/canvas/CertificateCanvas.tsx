import React from 'react';
import { useCardRenderer } from '../../hooks/useCardRenderer';
import type { CardData } from '../../types/card';

interface CertificateCanvasProps {
  cardData: CardData;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const CertificateCanvas: React.FC<CertificateCanvasProps> = ({ cardData, canvasRef: forwardedRef }) => {
  const { canvasRef } = useCardRenderer(cardData, forwardedRef);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: 375,
        height: 500,
        borderRadius: 8,
        backgroundColor: '#F5F0E8',
      }}
    />
  );
};

export default CertificateCanvas;
