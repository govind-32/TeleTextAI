import type { ComponentType } from 'react';
import type { TeletextPageProps } from '../types';
import {
  HomePage,
  HeadlinesPage,
  WeatherPage,
  CryptoPage,
  PixelArtPage,
  AssistantPage,
  SettingsPage,
} from '../components/pages';

/**
 * Extended page definition that includes the component reference
 * Requirements: 2.2, 3.2
 */
export interface PageRegistryEntry {
  number: number;
  title: string;
  component: ComponentType<TeletextPageProps>;
  category: 'info' | 'interactive' | 'settings';
}

/**
 * PAGE_REGISTRY - Central registry of all teletext pages
 * Maps page numbers to their components, titles, and categories
 * Requirements: 2.2, 3.2
 */
export const PAGE_REGISTRY: PageRegistryEntry[] = [
  { number: 100, title: 'HOME', component: HomePage, category: 'info' },
  { number: 101, title: 'AI HEADLINES', component: HeadlinesPage, category: 'info' },
  { number: 102, title: 'WEATHER', component: WeatherPage, category: 'interactive' },
  { number: 103, title: 'CRYPTO', component: CryptoPage, category: 'info' },
  { number: 105, title: 'PIXEL ART', component: PixelArtPage, category: 'interactive' },
  { number: 199, title: 'ASSISTANT', component: AssistantPage, category: 'interactive' },
  { number: 900, title: 'SETTINGS', component: SettingsPage, category: 'settings' },
];

/**
 * Get a page entry by its number
 */
export function getPageByNumber(pageNumber: number): PageRegistryEntry | undefined {
  return PAGE_REGISTRY.find((page) => page.number === pageNumber);
}

/**
 * Get all valid page numbers
 */
export function getValidPageNumbers(): number[] {
  return PAGE_REGISTRY.map((page) => page.number);
}

/**
 * Check if a page number is valid
 */
export function isValidPageNumber(pageNumber: number): boolean {
  return PAGE_REGISTRY.some((page) => page.number === pageNumber);
}

/**
 * Default page number (Home)
 */
export const DEFAULT_PAGE = 100;
