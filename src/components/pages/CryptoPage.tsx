import React, { useState, useEffect } from 'react';
import type { TeletextPageProps, CoinData } from '../../types';
import { PageShell } from './PageShell';
import { cryptoService } from '../../services/CryptoService';

/**
 * CryptoPage - Cryptocurrency prices display (page 103)
 * Requirements: 6.1, 6.2, 6.4
 */
export const CryptoPage: React.FC<TeletextPageProps> = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);

      const result = await cryptoService.getTopCoins(5);

      if (result.success && result.data) {
        setCoins(result.data);
      } else {
        setError(result.error || 'Failed to fetch crypto data');
        // Fallback data for demo
        setCoins([
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 43250.00, change24h: 2.5 },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2280.00, change24h: -1.2 },
          { id: 'tether', name: 'Tether', symbol: 'USDT', price: 1.00, change24h: 0.01 },
          { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 312.50, change24h: 3.8 },
          { id: 'solana', name: 'Solana', symbol: 'SOL', price: 98.75, change24h: -0.5 },
        ]);
      }

      setLoading(false);
    };

    fetchCoins();
  }, []);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number): { text: string; color: string } => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'var(--color-teletext-green)' : 'var(--color-teletext-red)';
    return { text: `${sign}${change.toFixed(2)}%`, color };
  };

  if (loading) {
    return (
      <PageShell pageNumber={103} title="CRYPTO">
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-teletext-cyan)' }}>
            ▌ LOADING CRYPTO DATA...
          </p>
          <div style={{ 
            marginTop: '16px',
            color: 'var(--color-teletext-orange)',
          }}>
            ████████████████████
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell pageNumber={103} title="CRYPTO">
      <div style={{ padding: '8px 0' }}>
        {/* Error banner */}
        {error && (
          <div style={{
            background: 'var(--color-teletext-red)',
            color: 'var(--color-teletext-bg)',
            padding: '4px 8px',
            marginBottom: '12px',
            fontSize: '12px',
          }}>
            ⚠ {error} - Showing cached data
          </div>
        )}

        {/* Header */}
        <div style={{ 
          color: 'var(--color-teletext-cyan)',
          marginBottom: '12px',
          borderBottom: '1px solid var(--color-teletext-cyan)',
          paddingBottom: '4px',
        }}>
          ▌ TOP 5 CRYPTOCURRENCIES
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1.5fr',
          gap: '8px',
          padding: '4px 0',
          borderBottom: '1px solid var(--color-teletext-yellow)',
          marginBottom: '8px',
          fontSize: '12px',
          color: 'var(--color-teletext-yellow)',
        }}>
          <span>COIN</span>
          <span style={{ textAlign: 'right' }}>PRICE</span>
          <span style={{ textAlign: 'right' }}>24H</span>
        </div>

        {/* Coin rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {coins.map((coin, index) => {
            const change = formatChange(coin.change24h);
            return (
              <div
                key={coin.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr',
                  gap: '8px',
                  padding: '8px 0',
                  borderBottom: '1px dotted var(--color-teletext-primary)',
                }}
              >
                {/* Coin name and symbol */}
                <div>
                  <span style={{ 
                    color: 'var(--color-teletext-orange)',
                    marginRight: '4px',
                  }}>
                    {index + 1}.
                  </span>
                  <span style={{ color: 'var(--color-teletext-primary)' }}>
                    {coin.name}
                  </span>
                  <span style={{ 
                    color: 'var(--color-teletext-cyan)',
                    fontSize: '12px',
                    marginLeft: '4px',
                  }}>
                    ({coin.symbol})
                  </span>
                </div>

                {/* Price */}
                <span style={{ 
                  textAlign: 'right',
                  color: 'var(--color-teletext-primary)',
                }}>
                  {formatPrice(coin.price)}
                </span>

                {/* 24h change */}
                <span style={{ 
                  textAlign: 'right',
                  color: change.color,
                  fontWeight: 'bold',
                }}>
                  {change.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '16px',
          paddingTop: '8px',
          borderTop: '1px solid var(--color-teletext-primary)',
          fontSize: '12px',
          color: 'var(--color-teletext-cyan)',
        }}>
          Data from CoinGecko • Cached for 5 minutes
        </div>
      </div>
    </PageShell>
  );
};

export default CryptoPage;
