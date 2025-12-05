import React, { useState } from 'react';
import type { TeletextPageProps, WeatherData, HourlyForecast } from '../../types';
import { PageShell } from './PageShell';
import { weatherService } from '../../services/WeatherService';

// Weather condition to pixel icon mapping
const WEATHER_ICONS: Record<string, string> = {
  Clear: '☀',
  Clouds: '☁',
  Rain: '🌧',
  Drizzle: '🌦',
  Thunderstorm: '⛈',
  Snow: '❄',
  Mist: '🌫',
  Fog: '🌫',
  Haze: '🌫',
  Unknown: '?',
};

/**
 * WeatherPage - Weather information display (page 102)
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */
export const WeatherPage: React.FC<TeletextPageProps> = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    const [weatherResult, forecastResult] = await Promise.all([
      weatherService.getCurrentWeather(city),
      weatherService.getHourlyForecast(city),
    ]);

    if (weatherResult.success && weatherResult.data) {
      setWeather(weatherResult.data);
    } else {
      setError(weatherResult.error || 'Failed to fetch weather');
      setWeather(null);
    }

    if (forecastResult.success && forecastResult.data) {
      setForecast(forecastResult.data);
    } else {
      setForecast([]);
    }

    setLoading(false);
  };

  const getWeatherIcon = (condition: string): string => {
    return WEATHER_ICONS[condition] || WEATHER_ICONS.Unknown;
  };

  return (
    <PageShell pageNumber={102} title="WEATHER">
      <div style={{ padding: '8px 0' }}>
        {/* City input form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block',
            color: 'var(--color-teletext-cyan)',
            marginBottom: '8px',
          }}>
            ▌ ENTER CITY NAME
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. London, New York"
              className="teletext-input"
              aria-label="Enter city name for weather lookup"
              style={{
                flex: 1,
                background: 'var(--color-teletext-bg)',
                border: '1px solid var(--color-teletext-cyan)',
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
              aria-label="Fetch weather data"
              style={{
                background: 'var(--color-teletext-cyan)',
                color: 'var(--color-teletext-bg)',
                border: 'none',
                padding: '8px 16px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'inherit',
                fontWeight: 'bold',
              }}
            >
              {loading ? '...' : 'GO'}
            </button>
          </div>
        </form>

        {/* Error display */}
        {error && (
          <div style={{
            background: 'var(--color-teletext-red)',
            color: 'var(--color-teletext-bg)',
            padding: '8px',
            marginBottom: '16px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ color: 'var(--color-teletext-yellow)' }}>
              FETCHING WEATHER DATA...
            </p>
          </div>
        )}

        {/* Weather display */}
        {weather && !loading && (
          <div>
            {/* Current weather */}
            <div style={{
              border: '1px solid var(--color-teletext-yellow)',
              padding: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <span style={{ 
                  color: 'var(--color-teletext-yellow)',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                  {weather.city.toUpperCase()}
                </span>
                <span style={{ fontSize: '24px' }}>
                  {getWeatherIcon(weather.condition)}
                </span>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}>
                <div>
                  <span style={{ color: 'var(--color-teletext-cyan)' }}>TEMP:</span>
                  <span style={{ 
                    color: 'var(--color-teletext-orange)',
                    marginLeft: '8px',
                    fontSize: '20px',
                  }}>
                    {weather.temperature}°C
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-teletext-cyan)' }}>HUMIDITY:</span>
                  <span style={{ marginLeft: '8px' }}>{weather.humidity}%</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--color-teletext-cyan)' }}>CONDITIONS:</span>
                  <span style={{ 
                    color: 'var(--color-teletext-green)',
                    marginLeft: '8px',
                  }}>
                    {weather.condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly forecast */}
            {forecast.length > 0 && (
              <div>
                <p style={{ 
                  color: 'var(--color-teletext-cyan)',
                  marginBottom: '8px',
                  borderBottom: '1px solid var(--color-teletext-cyan)',
                  paddingBottom: '4px',
                }}>
                  ▌ HOURLY FORECAST
                </p>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  fontSize: '12px',
                }}>
                  {forecast.slice(0, 8).map((hour, index) => (
                    <div 
                      key={index}
                      style={{
                        textAlign: 'center',
                        padding: '4px',
                        border: '1px solid var(--color-teletext-primary)',
                      }}
                    >
                      <div style={{ color: 'var(--color-teletext-yellow)' }}>
                        {String(hour.hour).padStart(2, '0')}:00
                      </div>
                      <div style={{ fontSize: '16px' }}>
                        {getWeatherIcon(hour.condition)}
                      </div>
                      <div style={{ color: 'var(--color-teletext-orange)' }}>
                        {hour.temperature}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial state - no city searched yet */}
        {!weather && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px',
            color: 'var(--color-teletext-primary)',
          }}>
            <p style={{ marginBottom: '8px' }}>
              Enter a city name above to view weather
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-teletext-cyan)' }}>
              Data cached for 10 minutes
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default WeatherPage;
