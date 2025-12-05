import React, { useState } from 'react';
import type { TeletextPageProps, PixelArtGrid } from '../../types';
import { PageShell } from './PageShell';
import { llmService } from '../../services/LLMService';

/**
 * PixelArtPage - AI-generated pixel art (page 105)
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export const PixelArtPage: React.FC<TeletextPageProps> = () => {
  const [prompt, setPrompt] = useState('');
  const [pixelArt, setPixelArt] = useState<PixelArtGrid | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    const result = await llmService.generatePixelArt(prompt);

    if (result.success && result.data) {
      setPixelArt(result.data);
    } else {
      setError(result.error || 'Failed to generate pixel art');
      // Fallback demo art (simple smiley face)
      setPixelArt({
        pixels: [
          ['#080808', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#080808'],
          ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'],
          ['#FFFF00', '#FFFF00', '#080808', '#FFFF00', '#FFFF00', '#080808', '#FFFF00', '#FFFF00'],
          ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'],
          ['#FFFF00', '#080808', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#080808', '#FFFF00'],
          ['#FFFF00', '#FFFF00', '#080808', '#080808', '#080808', '#080808', '#FFFF00', '#FFFF00'],
          ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'],
          ['#080808', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#080808'],
        ],
      });
    }

    setLoading(false);
  };

  return (
    <PageShell pageNumber={105} title="PIXEL ART">
      <div style={{ padding: '8px 0' }}>
        {/* Prompt input form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: 'var(--color-teletext-cyan)',
            marginBottom: '8px',
          }}>
            ▌ ENTER ART PROMPT
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. a red heart, a blue star"
              className="teletext-input"
              aria-label="Enter prompt for pixel art generation"
              style={{
                flex: 1,
                background: 'var(--color-teletext-bg)',
                border: '1px solid var(--color-teletext-orange)',
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
              aria-label="Generate pixel art"
              style={{
                background: 'var(--color-teletext-orange)',
                color: 'var(--color-teletext-bg)',
                border: 'none',
                padding: '8px 16px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
              }}
            >
              {loading ? '...' : 'CREATE'}
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
            ⚠ {error} - Showing demo art
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <p style={{ color: 'var(--color-teletext-yellow)' }}>
              GENERATING PIXEL ART...
            </p>
            <div style={{ 
              marginTop: '16px',
              color: 'var(--color-teletext-magenta)',
            }}>
              ▓▓▓▓▓▓▓▓
            </div>
          </div>
        )}

        {/* Pixel art display */}
        {pixelArt && !loading && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: 'var(--color-teletext-cyan)',
              marginBottom: '12px',
            }}>
              ▌ 8×8 PIXEL ART
            </p>
            
            {/* 8x8 grid */}
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '2px',
              padding: '8px',
              background: 'var(--color-teletext-bg)',
              border: '2px solid var(--color-teletext-cyan)',
            }}>
              {pixelArt.pixels.map((row, rowIndex) =>
                row.map((color, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: color,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    title={`(${rowIndex},${colIndex}): ${color}`}
                  />
                ))
              )}
            </div>

            {/* Prompt display */}
            <p style={{ 
              marginTop: '12px',
              fontSize: '12px',
              color: 'var(--color-teletext-primary)',
            }}>
              Prompt: "{prompt}"
            </p>
          </div>
        )}

        {/* Initial state */}
        {!pixelArt && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px',
            color: 'var(--color-teletext-primary)',
          }}>
            <p style={{ marginBottom: '8px' }}>
              Enter a prompt to generate 8×8 pixel art
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-teletext-orange)' }}>
              AI will create art using teletext colors
            </p>
          </div>
        )}

        {/* Color palette reference */}
        <div style={{ 
          marginTop: '16px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-teletext-primary)',
        }}>
          <p style={{ 
            fontSize: '12px',
            color: 'var(--color-teletext-cyan)',
            marginBottom: '4px',
          }}>
            TELETEXT PALETTE:
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '4px',
            flexWrap: 'wrap',
          }}>
            {['#080808', '#E6D8B0', '#FF8C00', '#00FF00', '#FF0000', '#00FFFF', '#FFFF00', '#FF00FF'].map((color) => (
              <div
                key={color}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: color,
                  border: '1px solid var(--color-teletext-primary)',
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default PixelArtPage;
