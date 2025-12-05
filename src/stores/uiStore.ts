import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  crtIntensity: number;
  volume: number;
  theme: 'retro' | 'modern';
  setCrtIntensity: (value: number) => void;
  setVolume: (value: number) => void;
  setTheme: (theme: 'retro' | 'modern') => void;
}

const DEFAULT_CRT_INTENSITY = 70;
const DEFAULT_VOLUME = 50;
const DEFAULT_THEME: 'retro' | 'modern' = 'retro';

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      crtIntensity: DEFAULT_CRT_INTENSITY,
      volume: DEFAULT_VOLUME,
      theme: DEFAULT_THEME,
      setCrtIntensity: (value: number) => set({ crtIntensity: Math.max(0, Math.min(100, value)) }),
      setVolume: (value: number) => set({ volume: Math.max(0, Math.min(100, value)) }),
      setTheme: (theme: 'retro' | 'modern') => set({ theme }),
    }),
    {
      name: 'teletext-ui-settings',
    }
  )
);
