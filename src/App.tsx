import { useEffect, useCallback } from 'react';
import { TeletextViewport, CRTOverlay } from './components';
import { useKeyNav, useTeletext } from './hooks';
import { useUIStore } from './stores/uiStore';
import { usePagesStore } from './stores/pagesStore';
import { getPageByNumber, DEFAULT_PAGE } from './registry';
import './components/viewport/TeletextViewport.css';

/**
 * Main App component
 * Wires up TeletextViewport with CRT overlay and page routing
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
function App() {
  // Get UI settings from store
  const crtIntensity = useUIStore((state) => state.crtIntensity);
  
  // Initialize keyboard navigation
  const { currentPage, pageBuffer, navigateTo } = useKeyNav();
  
  // Get teletext utilities for audio feedback
  const { playSound } = useTeletext();
  
  // Get transitioning state for glitch effect
  const isTransitioning = usePagesStore((state) => state.isTransitioning);

  // Play sound on page change (Requirement 2.4)
  useEffect(() => {
    if (isTransitioning) {
      playSound('switch');
    }
  }, [isTransitioning, playSound]);

  // Handle navigation from page components
  const handleNavigate = useCallback((pageNumber: number) => {
    navigateTo(pageNumber);
  }, [navigateTo]);

  // Get the current page component from registry
  const pageEntry = getPageByNumber(currentPage);
  const PageComponent = pageEntry?.component;

  // Fallback to home page if page not found
  if (!PageComponent) {
    const homePage = getPageByNumber(DEFAULT_PAGE);
    if (homePage) {
      const HomeComponent = homePage.component;
      return (
        <TeletextViewport showCRT={true} crtIntensity={crtIntensity}>
          <HomeComponent isActive={true} onNavigate={handleNavigate} />
          <CRTOverlay intensity={crtIntensity} enabled={true} />
        </TeletextViewport>
      );
    }
  }

  return (
    <TeletextViewport showCRT={true} crtIntensity={crtIntensity}>
      {/* Page buffer display */}
      {pageBuffer && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '16px',
            color: 'var(--color-teletext-yellow)',
            fontSize: '18px',
            fontFamily: 'inherit',
            zIndex: 10,
          }}
        >
          P{pageBuffer.padEnd(3, '_')}
        </div>
      )}
      
      {/* Render current page component */}
      {PageComponent && (
        <PageComponent isActive={true} onNavigate={handleNavigate} />
      )}
      
      {/* CRT overlay on top of everything */}
      <CRTOverlay intensity={crtIntensity} enabled={true} />
    </TeletextViewport>
  );
}

export default App;
