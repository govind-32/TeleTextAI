import { useCallback, useRef } from 'react';
import { useUIStore } from '../stores/uiStore';

const TELETEXT_WIDTH = 40;

export type SoundType = 'switch' | 'error' | 'success';

export interface UseTeletextReturn {
  formatText: (text: string, maxWidth?: number) => string[];
  playSound: (soundType: SoundType) => void;
}

/**
 * Formats text with word wrapping at the specified width (default 40 chars).
 * Words longer than maxWidth are split across lines.
 */
export function formatText(text: string, maxWidth: number = TELETEXT_WIDTH): string[] {
  if (!text || text.length === 0) {
    return [];
  }

  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      if (word.length === 0) continue;

      // Handle words longer than maxWidth by splitting them
      if (word.length > maxWidth) {
        // First, push current line if not empty
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = '';
        }
        // Split the long word
        let remaining = word;
        while (remaining.length > maxWidth) {
          lines.push(remaining.slice(0, maxWidth));
          remaining = remaining.slice(maxWidth);
        }
        if (remaining.length > 0) {
          currentLine = remaining;
        }
        continue;
      }

      // Check if word fits on current line
      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxWidth) {
        currentLine += ' ' + word;
      } else {
        // Word doesn't fit, start new line
        lines.push(currentLine);
        currentLine = word;
      }
    }

    // Push remaining content
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export function useTeletext(): UseTeletextReturn {
  const volume = useUIStore((state) => state.volume);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(
    (soundType: SoundType) => {
      if (volume === 0) return;

      // Lazy init AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Set volume (0-100 -> 0-0.3)
      const normalizedVolume = (volume / 100) * 0.3;
      gainNode.gain.setValueAtTime(normalizedVolume, ctx.currentTime);

      // Configure sound based on type
      switch (soundType) {
        case 'switch':
          oscillator.frequency.setValueAtTime(800, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(200, ctx.currentTime);
          oscillator.type = 'square';
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
          break;
        case 'success':
          oscillator.frequency.setValueAtTime(600, ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
          break;
      }
    },
    [volume]
  );

  return {
    formatText,
    playSound,
  };
}
