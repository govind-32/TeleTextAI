import React from 'react';

export interface CRTOverlayProps {
  intensity?: number; // 0-100
  enabled?: boolean;
}

/**
 * CRTOverlay - Applies CRT visual effects including scanlines and vignette
 * Requirements: 1.3
 */
export const CRTOverlay: React.FC<CRTOverlayProps> = ({
  intensity = 50,
  enabled = true,
}) => {
  if (!enabled) return null;

  // Normalize intensity to 0-1 range
  const normalizedIntensity = Math.max(0, Math.min(100, intensity)) / 100;
  
  // Calculate effect strengths based on intensity
  const scanlineOpacity = 0.15 * normalizedIntensity;
  const vignetteOpacity = 0.6 * normalizedIntensity;
  const glowIntensity = 10 * normalizedIntensity;

  return (
    <div 
      className="crt-overlay"
      data-testid="crt-overlay"
      data-intensity={intensity}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Scanlines effect */}
      <div
        className="crt-scanlines"
        data-testid="crt-scanlines"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, ${scanlineOpacity}) 0px,
            rgba(0, 0, 0, ${scanlineOpacity}) 1px,
            transparent 1px,
            transparent 2px
          )`,
          pointerEvents: 'none',
        }}
      />
      
      {/* Vignette effect - radial gradient darkening edges */}
      <div
        className="crt-vignette"
        data-testid="crt-vignette"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, ${vignetteOpacity * 0.3}) 70%,
            rgba(0, 0, 0, ${vignetteOpacity * 0.6}) 85%,
            rgba(0, 0, 0, ${vignetteOpacity}) 100%
          )`,
          pointerEvents: 'none',
        }}
      />
      
      {/* Subtle screen glow effect */}
      <div
        className="crt-glow"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: `inset 0 0 ${glowIntensity}px rgba(230, 216, 176, 0.05)`,
          pointerEvents: 'none',
        }}
      />
      
      {/* Subtle color aberration / RGB shift effect */}
      <div
        className="crt-aberration"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            90deg,
            rgba(255, 0, 0, ${0.02 * normalizedIntensity}) 0%,
            transparent 10%,
            transparent 90%,
            rgba(0, 0, 255, ${0.02 * normalizedIntensity}) 100%
          )`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CRTOverlay;
