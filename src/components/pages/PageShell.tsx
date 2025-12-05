import React, { useState, useRef, useLayoutEffect } from 'react';
import { Glitch } from '../viewport/Glitch';

export interface PageShellProps {
  /** Three-digit page number (100-999) */
  pageNumber: number;
  /** Page title displayed in header */
  title: string;
  /** Page content */
  children: React.ReactNode;
  /** Whether to show glitch effect on mount */
  showGlitchOnMount?: boolean;
}

/**
 * PageShell - Wrapper component providing consistent header and transition effects
 * Requirements: 1.4
 */
export const PageShell: React.FC<PageShellProps> = ({
  pageNumber,
  title,
  children,
  showGlitchOnMount = true,
}) => {
  // Initialize glitch state based on showGlitchOnMount prop
  const [glitchActive, setGlitchActive] = useState(showGlitchOnMount);
  const hasTriggeredRef = useRef(false);

  // Use layout effect to ensure glitch triggers before paint on mount
  useLayoutEffect(() => {
    if (showGlitchOnMount && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      // Glitch is already active from initial state
    }
  }, [showGlitchOnMount]);

  const handleGlitchComplete = () => {
    setGlitchActive(false);
  };

  // Format page number as 3 digits
  const formattedPageNumber = String(pageNumber).padStart(3, '0');

  return (
    <Glitch active={glitchActive} onComplete={handleGlitchComplete}>
      <div 
        className="page-shell"
        data-testid="page-shell"
        data-page-number={pageNumber}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Header with page number and title */}
        <header 
          className="page-header"
          data-testid="page-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            borderBottom: '2px solid var(--color-teletext-cyan)',
            marginBottom: '8px',
          }}
        >
          {/* Page number badge */}
          <span
            className="page-number"
            style={{
              backgroundColor: 'var(--color-teletext-cyan)',
              color: 'var(--color-teletext-bg)',
              padding: '2px 8px',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            P{formattedPageNumber}
          </span>
          
          {/* Page title */}
          <span
            className="page-title"
            style={{
              color: 'var(--color-teletext-yellow)',
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
          
          {/* Teletext branding */}
          <span
            className="teletext-brand"
            style={{
              color: 'var(--color-teletext-orange)',
              fontSize: '14px',
            }}
          >
            TELETEXT
          </span>
        </header>

        {/* Page content area */}
        <main 
          className="page-content"
          data-testid="page-content"
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          {children}
        </main>

        {/* Footer with navigation hints */}
        <footer
          className="page-footer"
          data-testid="page-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 0',
            borderTop: '1px solid var(--color-teletext-primary)',
            marginTop: '8px',
            fontSize: '14px',
            color: 'var(--color-teletext-green)',
          }}
        >
          <span>◄ PREV</span>
          <span>ENTER PAGE NUMBER</span>
          <span>NEXT ►</span>
        </footer>
      </div>
    </Glitch>
  );
};

export default PageShell;
