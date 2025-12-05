// Core Teletext Types

export interface TeletextPageProps {
  isActive: boolean;
  onNavigate: (pageNumber: number) => void;
}

export interface PageDefinition {
  number: number;
  title: string;
  category: 'info' | 'interactive' | 'settings';
}

export interface TeletextCell {
  char: string;
  foreground: string;
  background: string;
  blink: boolean;
}

export type TeletextGrid = TeletextCell[][];

// Service Types
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Settings
export interface UserSettings {
  crtIntensity: number;
  volume: number;
  theme: 'retro' | 'modern';
  lastCity: string;
}

// LLM Service Types
export interface Headline {
  title: string;
  snippet: string;
  source: string;
}

export interface PixelArtGrid {
  pixels: string[][]; // 8x8 array of hex colors
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantResponse {
  message: string;
  suggestions: string[];
}

// Weather Service Types
export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
}

export interface HourlyForecast {
  hour: number;
  temperature: number;
  condition: string;
}

// Crypto Service Types
export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

// Teletext Colors
export type TeletextColor = 
  | 'bg'
  | 'primary'
  | 'orange'
  | 'green'
  | 'red'
  | 'cyan'
  | 'yellow'
  | 'magenta'
  | 'blue'
  | 'white';
