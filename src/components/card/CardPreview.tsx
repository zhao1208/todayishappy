import React, { useState, useCallback, useRef } from 'react';
import type { CardData } from '../../types/card';
import CertificateCanvas from '../canvas/CertificateCanvas';
import StampAnimation from '../canvas/StampAnimation';

interface CardPreviewProps {
  cardData: CardData;
  showStampAnimation: boolean;
  onStampDone?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  cardData,
  showStampAnimation,
  onStampDone,
  canvasRef,
}) => {
  const [stampVisible, setStampVisible] = useState(showStampAnimation);
  const [cardRisen, setCardRisen] = useState(false);

  // Trigger the card-rise animation after a brief delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCardRisen(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleStampDone = useCallback(() => {
    setStampVisible(false);
    onStampDone?.();
  }, [onStampDone]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: cardRisen ? 'translateY(0)' : 'translateY(30px)',
        opacity: cardRisen ? 1 : 0,
        transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease',
      }}
    >
      {/* Canvas */}
      <CertificateCanvas cardData={cardData} canvasRef={canvasRef} />

      {/* Stamp animation overlay */}
      <StampAnimation visible={stampVisible} onDone={handleStampDone} />
    </div>
  );
};

export default CardPreview;
