import React, { useState, useEffect } from 'react';
import type { TeletextPageProps, Headline } from '../../types';
import { PageShell } from './PageShell';
import { llmService } from '../../services/LLMService';

// Sample news content for demo (in production, this would come from a news API)
const SAMPLE_NEWS_CONTENT = `
Breaking: Tech stocks surge as AI investments continue to grow.
Weather: Severe storms expected across the midwest this weekend.
Sports: Local team wins championship in overtime thriller.
Business: Central bank announces interest rate decision.
Science: New discovery in renewable energy technology.
Entertainment: Award-winning film breaks box office records.
`;

/**
 * HeadlinesPage - AI-generated news headlines (page 101)
 * Requirements: 4.1, 4.2, 4.4
 */
export const HeadlinesPage: React.FC<TeletextPageProps> = () => {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      setLoading(true);
      setError(null);
      
      const result = await llmService.summarizeHeadlines(SAMPLE_NEWS_CONTENT);
      
      if (result.success && result.data) {
        setHeadlines(result.data.slice(0, 6)); // Max 6 headlines
      } else {
        setError(result.error || 'Failed to load headlines');
        // Fallback headlines for demo
        setHeadlines([
          { title: 'TECH STOCKS SURGE', snippet: 'AI investments drive market gains', source: 'FINANCE' },
          { title: 'WEATHER ALERT', snippet: 'Storms expected across midwest', source: 'WEATHER' },
          { title: 'CHAMPIONSHIP WIN', snippet: 'Local team wins in overtime', source: 'SPORTS' },
          { title: 'RATE DECISION', snippet: 'Central bank holds steady', source: 'BUSINESS' },
          { title: 'ENERGY BREAKTHROUGH', snippet: 'New renewable tech discovered', source: 'SCIENCE' },
          { title: 'BOX OFFICE RECORD', snippet: 'Award film breaks records', source: 'ENTERTAINMENT' },
        ]);
      }
      
      setLoading(false);
    };

    fetchHeadlines();
  }, []);

  if (loading) {
    return (
      <PageShell pageNumber={101} title="AI HEADLINES">
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-teletext-cyan)' }}>
            ▌ LOADING HEADLINES...
          </p>
          <div style={{ 
            marginTop: '16px',
            color: 'var(--color-teletext-yellow)',
            animation: 'blink 1s infinite',
          }}>
            ████████████████████
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell pageNumber={101} title="AI HEADLINES">
      <div style={{ padding: '8px 0' }}>
        {/* Error banner if API failed but showing fallback */}
        {error && (
          <div style={{ 
            background: 'var(--color-teletext-red)',
            color: 'var(--color-teletext-bg)',
            padding: '4px 8px',
            marginBottom: '12px',
            fontSize: '12px',
          }}>
            ⚠ {error} - Showing cached headlines
          </div>
        )}

        {/* Headlines list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {headlines.map((headline, index) => (
            <div 
              key={index}
              style={{
                borderLeft: '3px solid var(--color-teletext-cyan)',
                paddingLeft: '8px',
              }}
            >
              {/* Headline number and title */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '2px',
              }}>
                <span style={{ 
                  color: 'var(--color-teletext-orange)',
                  fontWeight: 'bold',
                }}>
                  {index + 1}.
                </span>
                <span style={{ 
                  color: 'var(--color-teletext-yellow)',
                  fontWeight: 'bold',
                }}>
                  {headline.title}
                </span>
              </div>
              
              {/* Snippet */}
              <p style={{ 
                color: 'var(--color-teletext-primary)',
                fontSize: '14px',
                margin: '0 0 2px 18px',
              }}>
                {headline.snippet}
              </p>
              
              {/* Source */}
              <span style={{ 
                color: 'var(--color-teletext-green)',
                fontSize: '12px',
                marginLeft: '18px',
              }}>
                [{headline.source}]
              </span>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{ 
          marginTop: '16px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-teletext-primary)',
          fontSize: '12px',
          color: 'var(--color-teletext-cyan)',
        }}>
          Headlines generated by AI • Updated every 10 minutes
        </div>
      </div>
    </PageShell>
  );
};

export default HeadlinesPage;
