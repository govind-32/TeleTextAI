import React from 'react';
import type { TeletextPageProps, PageDefinition } from '../../types';
import { PageShell } from './PageShell';

/**
 * Page registry for navigation tiles
 */
const PAGE_TILES: PageDefinition[] = [
  { number: 100, title: 'HOME', category: 'info' },
  { number: 101, title: 'AI HEADLINES', category: 'info' },
  { number: 102, title: 'WEATHER', category: 'interactive' },
  { number: 103, title: 'CRYPTO', category: 'info' },
  { number: 105, title: 'PIXEL ART', category: 'interactive' },
  { number: 199, title: 'ASSISTANT', category: 'interactive' },
  { number: 900, title: 'SETTINGS', category: 'settings' },
];

const categoryColors: Record<string, string> = {
  info: 'var(--color-teletext-cyan)',
  interactive: 'var(--color-teletext-orange)',
  settings: 'var(--color-teletext-yellow)',
};

/**
 * HomePage - Main landing page (page 100)
 * Requirements: 3.1, 3.2, 3.3
 */
export const HomePage: React.FC<TeletextPageProps> = ({ onNavigate }) => {
  return (
    <PageShell pageNumber={100} title="HOME">
      <div style={{ padding: '8px 0' }}>
        {/* Welcome message */}
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ 
            color: 'var(--color-teletext-cyan)', 
            fontSize: '18px',
            marginBottom: '8px' 
          }}>
            ═══ WELCOME TO TELETEXT UNIVERSE ═══
          </p>
          <p style={{ color: 'var(--color-teletext-primary)' }}>
            A modern reimagining of classic 1980s teletext
          </p>
        </div>

        {/* Page tiles grid */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ 
            color: 'var(--color-teletext-yellow)', 
            marginBottom: '12px',
            borderBottom: '1px solid var(--color-teletext-yellow)',
            paddingBottom: '4px'
          }}>
            ▌ AVAILABLE PAGES
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}>
            {PAGE_TILES.filter(p => p.number !== 100).map((page) => (
              <button
                key={page.number}
                onClick={() => onNavigate(page.number)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(page.number);
                  }
                }}
                className="teletext-focusable"
                aria-label={`Navigate to page ${page.number}: ${page.title}`}
                style={{
                  background: 'transparent',
                  border: `1px solid ${categoryColors[page.category]}`,
                  padding: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = categoryColors[page.category];
                  e.currentTarget.style.color = 'var(--color-teletext-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'inherit';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = categoryColors[page.category];
                  e.currentTarget.style.color = 'var(--color-teletext-bg)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                <span style={{ 
                  color: 'inherit',
                  fontWeight: 'bold',
                  display: 'block',
                }}>
                  P{page.number}
                </span>
                <span style={{ 
                  color: 'inherit',
                  fontSize: '14px',
                }}>
                  {page.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation instructions */}
        <div style={{ 
          borderTop: '1px solid var(--color-teletext-green)',
          paddingTop: '12px',
          marginTop: '16px',
        }}>
          <p style={{ 
            color: 'var(--color-teletext-green)', 
            marginBottom: '8px' 
          }}>
            ▌ NAVIGATION INSTRUCTIONS
          </p>
          <div style={{ 
            color: 'var(--color-teletext-primary)',
            fontSize: '14px',
            lineHeight: '1.6',
          }}>
            <p>• Press <span style={{ color: 'var(--color-teletext-orange)' }}>0-9</span> to enter page number</p>
            <p>• Press <span style={{ color: 'var(--color-teletext-orange)' }}>← →</span> for prev/next page</p>
            <p>• Press <span style={{ color: 'var(--color-teletext-orange)' }}>TAB</span> to navigate elements</p>
            <p>• Press <span style={{ color: 'var(--color-teletext-orange)' }}>ENTER</span> to select</p>
          </div>
        </div>

        {/* Category legend */}
        <div style={{ 
          marginTop: '16px',
          fontSize: '12px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }}>
          <span>
            <span style={{ color: categoryColors.info }}>■</span> Info
          </span>
          <span>
            <span style={{ color: categoryColors.interactive }}>■</span> Interactive
          </span>
          <span>
            <span style={{ color: categoryColors.settings }}>■</span> Settings
          </span>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;
