import type { ApiResult, WeatherData, HourlyForecast } from '../types';
import cacheService from './CacheService';

/**
 * WeatherService - Fetches weather data from OpenWeatherMap
 * Requirements: 5.2, 5.4
 */

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_CACHE_TTL = 10; // minutes

function getApiKey(): string {
  return import.meta.env.VITE_OPENWEATHER_API_KEY || '';
}

/**
 * Get current weather for a city
 */
export async function getCurrentWeather(city: string): Promise<ApiResult<WeatherData>> {
  const cacheKey = `weather_current_${city.toLowerCase()}`;
  
  // Check cache first
  const cached = cacheService.get<WeatherData>(cacheKey);
  if (cached) {
    return { success: true, data: cached };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Weather API key not configured' };
  }

  try {
    const url = `${OPENWEATHER_API_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'City not found' };
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    const weatherData: WeatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0]?.main || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      humidity: data.main.humidity,
    };

    cacheService.set(cacheKey, weatherData, WEATHER_CACHE_TTL);
    return { success: true, data: weatherData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}


/**
 * Get hourly forecast for a city
 */
export async function getHourlyForecast(city: string): Promise<ApiResult<HourlyForecast[]>> {
  const cacheKey = `weather_hourly_${city.toLowerCase()}`;
  
  // Check cache first
  const cached = cacheService.get<HourlyForecast[]>(cacheKey);
  if (cached) {
    return { success: true, data: cached };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Weather API key not configured' };
  }

  try {
    const url = `${OPENWEATHER_API_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=8`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'City not found' };
      }
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    const forecasts: HourlyForecast[] = data.list.map((item: {
      dt: number;
      main: { temp: number };
      weather: Array<{ main: string }>;
    }) => ({
      hour: new Date(item.dt * 1000).getHours(),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0]?.main || 'Unknown',
    }));

    cacheService.set(cacheKey, forecasts, WEATHER_CACHE_TTL);
    return { success: true, data: forecasts };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Service unavailable' 
    };
  }
}

export const weatherService = {
  getCurrentWeather,
  getHourlyForecast,
};

export default weatherService;
