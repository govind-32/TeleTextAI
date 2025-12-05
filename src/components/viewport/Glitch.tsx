import React, { useState, useEffect, useCallback } from 'react';

export interface GlitchProps {
  /** Whether the glitch effect is currently active */
  active?: boolean;
  /** Duration of the glitch effect in milliseconds */
  duration?: number;
  /** Callback when glitch animation completes */
  onComplete?: () => void;
  /** Children to render with glitch effect */
  children?: React.ReactNode;
}

/**
 * Glitch - Visual distortion effect for page transitions
 * Implements CSS transform and hue-rotate animations
 * Requirements: 1.4
 */
export const Glitch: React.FC<GlitchProps> = ({
  active = false,
  duration = 200,
  onComplete,
  children,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchFrame, setGlitchFrame] = useState(0);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setGlitchFrame(0);
    
    // Animate through glitch frames
    const frameCount = 5;
    const frameInterval = duration / frameCount;
    let currentFrame = 0;
    
    const frameTimer = setInterval(() => {
      currentFrame++;
      setGlitchFrame(currentFrame);
      
      if (currentFrame >= frameCount) {
        clearInterval(frameTimer);
        setIsGlitching(false);
        setGlitchFrame(0);
        onComplete?.();
      }
    }, frameInterval);
    
    return () => clearInterval(frameTimer);
  }, [duration, onComplete]);

  useEffect(() => {
    if (active) {
      const cleanup = triggerGlitch();
      return cleanup;
    }
  }, [active, triggerGlitch]);

  // Generate random glitch transforms based on current frame
  const getGlitchStyle = (): React.CSSProperties => {
    if (!isGlitching) return {};
    
    // Different glitch effects per frame
    const effects = [
      { transform: 'translateX(-2px) skewX(1deg)', filter: 'hue-rotate(90deg)' },
      { transform: 'translateX(3px) skewX(-2deg)', filter: 'hue-rotate(180deg) brightness(1.2)' },
      { transform: 'translateY(-1px) scaleY(1.02)', filter: 'hue-rotate(270deg)' },
      { transform: 'translateX(-1px) translateY(1px)', filter: 'saturate(2) contrast(1.1)' },
      { transform: 'none', filter: 'none' },
    ];
    
    return effects[glitchFrame % effects.length] || {};
  };

  return (
    <div 
      className={`glitch-container ${isGlitching ? 'glitching' : ''}`}
      data-testid="glitch-container"
      data-active={isGlitching}
      style={{
        position: 'relative',
        ...getGlitchStyle(),
        transition: isGlitching ? 'none' : 'all 0.1s ease-out',
      }}
    >
      {children}
      
      {/* Glitch overlay effects */}
      {isGlitching && (
        <>
          {/* Screen blink effect */}
          <div
            className="glitch-blink"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: glitchFrame % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
          
          {/* RGB split effect */}
          <div
            className="glitch-rgb"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(
                ${90 + glitchFrame * 30}deg,
                rgba(255, 0, 0, 0.1) 0%,
                transparent 33%,
                rgba(0, 255, 0, 0.1) 66%,
                rgba(0, 0, 255, 0.1) 100%
              )`,
              pointerEvents: 'none',
              zIndex: 99,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Glitch;
