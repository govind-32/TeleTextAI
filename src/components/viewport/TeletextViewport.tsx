import React from 'react';
import './TeletextViewport.css';

export interface TeletextViewportProps {
  children: React.ReactNode;
  showCRT?: boolean;
  crtIntensity?: number; // 0-100
}

/**
 * TeletextViewport - Main container that renders content in a 40x25 character grid
 * Mimics classic teletext displays with pixel font styling and base colors
 * Requirements: 1.1, 1.2, 11.1, 11.2, 11.3
 */
export const TeletextViewport: React.FC<TeletextViewportProps> = ({
  children,
  showCRT = true,
  crtIntensity = 50,
}) => {
  // 40 columns x 25 rows grid
  const COLS = 40;
  const ROWS = 25;
  
  return (
    <div className="teletext-viewport-container">
      {/* Small screen message - shown below 768px */}
      <div 
        className="teletext-small-screen-message"
        role="alert"
        aria-label="Screen size recommendation"
      >
        <div className="small-screen-content">
          <div className="small-screen-icon">📺</div>
          <h2>TELETEXT UNIVERSE</h2>
          <p>For the best experience, please use a larger screen or rotate to landscape orientation.</p>
          <p className="small-screen-hint">Minimum recommended width: 768px</p>
        </div>
      </div>

      {/* Main viewport - hidden below 768px */}
      <div 
        className="teletext-viewport-wrapper"
      >
        <div 
          className="teletext-viewport"
          role="main"
          aria-label="Teletext display viewport"
          data-testid="teletext-viewport"
          data-cols={COLS}
          data-rows={ROWS}
        >
          {/* Content wrapper that spans the full grid */}
          <div className="teletext-content">
            {children}
          </div>
        </div>
      </div>
      
      {/* Pass CRT props to be used by CRTOverlay when composed */}
      {showCRT && (
        <div 
          data-crt-intensity={crtIntensity}
          className="crt-overlay-slot"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default TeletextViewport;
