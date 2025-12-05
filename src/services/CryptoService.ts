import type { ApiResult, CoinData } from '../types';
import cacheService from './CacheService';

/**
 * CryptoService - Fetches cryptocurrency data from CoinGecko
 * Requirements: 6.1, 6.3
 */

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTO_CACHE_TTL = 5; // minutes

/**
 * Get top cryptocurrencies by market cap
 */
export async function getTopCoins(limit: number = 5): Promise<ApiResult<CoinData[]>> {
  const cacheKey = `crypto_top_${limit}`;
  
  // Check cache first
  const cached = cacheService.get<CoinData[]>(cacheKey);
  if (cached) {
    return { success: true, data: cached };
  }

  try {
    const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    const coins: CoinData[] = data.map((coin: {
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h: number;
    }) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h ?? 0,
    }));

    cacheService.set(cacheKey, coins, CRYPTO_CACHE_TTL);
    return { success: true, data: coins };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}

export const cryptoService = {
  getTopCoins,
};

export default cryptoService;
