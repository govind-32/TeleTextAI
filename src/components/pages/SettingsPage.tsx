import React from 'react';
import type { TeletextPageProps } from '../../types';
import { PageShell } from './PageShell';
import { useUIStore } from '../../stores/uiStore';

/**
 * SettingsPage - Display settings (page 900)
 * Requirements: 9.1, 9.2, 9.3
 */
export const SettingsPage: React.FC<TeletextPageProps> = () => {
  const { crtIntensity, volume, setCrtIntensity, setVolume } = useUIStore();

  return (
    <PageShell pageNumber={900} title="SETTINGS">
      <div style={{ padding: '8px 0' }}>
        {/* Header */}
        <div style={{ 
          color: 'var(--color-teletext-cyan)',
          marginBottom: '16px',
          borderBottom: '1px solid var(--color-teletext-cyan)',
          paddingBottom: '4px',
        }}>
          ▌ DISPLAY SETTINGS
        </div>

        {/* CRT Intensity slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <label style={{ color: 'var(--color-teletext-yellow)' }}>
              CRT EFFECT INTENSITY
            </label>
            <span style={{ 
              color: 'var(--color-teletext-orange)',
              fontWeight: 'bold',
            }}>
              {crtIntensity}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={crtIntensity}
            onChange={(e) => setCrtIntensity(Number(e.target.value))}
            className="teletext-slider"
            aria-label={`CRT effect intensity: ${crtIntensity}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={crtIntensity}
            style={{
              width: '100%',
              height: '8px',
              appearance: 'none',
              background: `linear-gradient(to right, var(--color-teletext-cyan) ${crtIntensity}%, var(--color-teletext-bg) ${crtIntensity}%)`,
              border: '1px solid var(--color-teletext-cyan)',
              cursor: 'pointer',
            }}
          />
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--color-teletext-primary)',
            marginTop: '4px',
          }}>
            <span>OFF</span>
            <span>FULL</span>
          </div>
          
          <p style={{ 
            fontSize: '12px',
            color: 'var(--color-teletext-primary)',
            marginTop: '8px',
          }}>
            Adjusts scanlines and vignette effects
          </p>
        </div>

        {/* Volume slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <label style={{ color: 'var(--color-teletext-yellow)' }}>
              AUDIO VOLUME
            </label>
            <span style={{ 
              color: 'var(--color-teletext-orange)',
              fontWeight: 'bold',
            }}>
              {volume}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="teletext-slider"
            aria-label={`Audio volume: ${volume}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volume}
            style={{
              width: '100%',
              height: '8px',
              appearance: 'none',
              background: `linear-gradient(to right, var(--color-teletext-green) ${volume}%, var(--color-teletext-bg) ${volume}%)`,
              border: '1px solid var(--color-teletext-green)',
              cursor: 'pointer',
            }}
          />
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--color-teletext-primary)',
            marginTop: '4px',
          }}>
            <span>MUTE</span>
            <span>MAX</span>
          </div>
          
          <p style={{ 
            fontSize: '12px',
            color: 'var(--color-teletext-primary)',
            marginTop: '8px',
          }}>
            Controls page switch and feedback sounds
          </p>
        </div>

        {/* Current settings summary */}
        <div style={{
          border: '1px solid var(--color-teletext-primary)',
          padding: '12px',
          marginTop: '16px',
        }}>
          <p style={{ 
            color: 'var(--color-teletext-cyan)',
            marginBottom: '8px',
            fontSize: '12px',
          }}>
            CURRENT SETTINGS:
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '14px',
          }}>
            <div>
              <span style={{ color: 'var(--color-teletext-primary)' }}>CRT: </span>
              <span style={{ color: 'var(--color-teletext-cyan)' }}>{crtIntensity}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-teletext-primary)' }}>VOL: </span>
              <span style={{ color: 'var(--color-teletext-green)' }}>{volume}%</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          marginTop: '16px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-teletext-primary)',
          fontSize: '12px',
          color: 'var(--color-teletext-cyan)',
        }}>
          Settings are saved automatically to localStorage
        </div>
      </div>
    </PageShell>
  );
};

export default SettingsPage;
