import React, { useState } from 'react';
import type { TeletextPageProps, ChatMessage } from '../../types';
import { PageShell } from './PageShell';
import { llmService } from '../../services/LLMService';
import { formatText } from '../../hooks/useTeletext';

/**
 * AssistantPage - AI chat assistant (page 199)
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export const AssistantPage: React.FC<TeletextPageProps> = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const newHistory: ChatMessage[] = [...history, { role: 'user', content: query }];
    
    const result = await llmService.chat(query, history);

    if (result.success && result.data) {
      setResponse(result.data.message);
      setSuggestions(result.data.suggestions.slice(0, 3));
      setHistory([...newHistory, { role: 'assistant', content: result.data.message }]);
    } else {
      setError(result.error || 'Failed to get response');
      // Fallback response
      const fallbackMsg = 'I apologize, but I am currently unavailable. Please try again later.';
      setResponse(fallbackMsg);
      setSuggestions(['What can you help with?', 'Tell me about teletext']);
    }

    setQuery('');
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  // Format response with 40-char line wrapping
  const formattedResponse = response ? formatText(response, 40) : [];

  return (
    <PageShell pageNumber={199} title="ASSISTANT">
      <div style={{ padding: '8px 0' }}>
        {/* Query input form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: 'var(--color-teletext-cyan)',
            marginBottom: '8px',
          }}>
            ▌ ASK THE ASSISTANT
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question..."
              className="teletext-input"
              aria-label="Enter your question for the assistant"
              style={{
                flex: 1,
                background: 'var(--color-teletext-bg)',
                border: '1px solid var(--color-teletext-magenta)',
                color: 'var(--color-teletext-primary)',
                padding: '8px',
                fontFamily: 'inherit',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="teletext-focusable"
              aria-label="Submit question to assistant"
              style={{
                background: 'var(--color-teletext-magenta)',
                color: 'var(--color-teletext-bg)',
                border: 'none',
                padding: '8px 16px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
              }}
            >
              {loading ? '...' : 'ASK'}
            </button>
          </div>
        </form>

        {/* Error display */}
        {error && (
          <div style={{
            background: 'var(--color-teletext-red)',
            color: 'var(--color-teletext-bg)',
            padding: '4px 8px',
            marginBottom: '12px',
            fontSize: '12px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ color: 'var(--color-teletext-yellow)' }}>
              THINKING...
            </p>
            <div style={{ 
              marginTop: '8px',
              color: 'var(--color-teletext-magenta)',
            }}>
              ▓▓▓▓▓▓▓▓▓▓
            </div>
          </div>
        )}

        {/* Response display */}
        {response && !loading && (
          <div>
            {/* Response box */}
            <div style={{
              border: '1px solid var(--color-teletext-magenta)',
              padding: '12px',
              marginBottom: '16px',
              background: 'rgba(255, 0, 255, 0.05)',
            }}>
              <p style={{ 
                color: 'var(--color-teletext-magenta)',
                marginBottom: '8px',
                fontSize: '12px',
              }}>
                ASSISTANT:
              </p>
              {/* Render response with 40-char line wrapping */}
              <div style={{ 
                color: 'var(--color-teletext-primary)',
                lineHeight: '1.5',
              }}>
                {formattedResponse.map((line, index) => (
                  <p key={index} style={{ margin: 0 }}>
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p style={{ 
                  color: 'var(--color-teletext-cyan)',
                  marginBottom: '8px',
                  fontSize: '12px',
                }}>
                  ▌ SUGGESTED FOLLOW-UPS:
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSuggestionClick(suggestion);
                        }
                      }}
                      className="teletext-focusable"
                      aria-label={`Ask follow-up: ${suggestion}`}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--color-teletext-cyan)',
                        color: 'var(--color-teletext-cyan)',
                        padding: '6px 8px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '12px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-teletext-cyan)';
                        e.currentTarget.style.color = 'var(--color-teletext-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-teletext-cyan)';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.background = 'var(--color-teletext-cyan)';
                        e.currentTarget.style.color = 'var(--color-teletext-bg)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--color-teletext-cyan)';
                      }}
                    >
                      → {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial state */}
        {!response && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px',
            color: 'var(--color-teletext-primary)',
          }}>
            <p style={{ marginBottom: '8px' }}>
              Ask me anything!
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-teletext-magenta)' }}>
              I'll respond in teletext style
            </p>
          </div>
        )}

        {/* Chat history indicator */}
        {history.length > 0 && (
          <div style={{ 
            marginTop: '16px',
            paddingTop: '8px',
            borderTop: '1px solid var(--color-teletext-primary)',
            fontSize: '12px',
            color: 'var(--color-teletext-cyan)',
          }}>
            Chat history: {Math.floor(history.length / 2)} exchanges
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default AssistantPage;
