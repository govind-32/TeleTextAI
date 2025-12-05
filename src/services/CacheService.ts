import type { CacheEntry } from '../types';

/**
 * CacheService - Manages localStorage caching with TTL support
 * Requirements: 4.3, 5.4, 6.3
 */
class CacheService {
  private prefix = 'teletext_cache_';

  /**
   * Get cached data by key
   * Returns null if not found or expired
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);
      
      if (this.isExpired(key)) {
        this.clear(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  /**
   * Set cached data with TTL in minutes
   */
  set<T>(key: string, value: T, ttlMinutes: number): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000, // Convert to milliseconds
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // localStorage might be full or unavailable
      console.warn('CacheService: Failed to write to localStorage');
    }
  }

  /**
   * Clear a specific cache entry
   */
  clear(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Check if a cache entry is expired
   */
  isExpired(key: string): boolean {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return true;

      const entry: CacheEntry<unknown> = JSON.parse(raw);
      const now = Date.now();
      const expiresAt = entry.timestamp + entry.ttl;

      return now > expiresAt;
    } catch {
      return true;
    }
  }

  /**
   * Clear all teletext cache entries
   */
  clearAll(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

export const cacheService = new CacheService();
export default cacheService;
