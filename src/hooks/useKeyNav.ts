import { useEffect, useRef, useCallback } from 'react';
import { usePagesStore } from '../stores/pagesStore';

const BUFFER_TIMEOUT_MS = 3000;

export interface UseKeyNavReturn {
  currentPage: number;
  pageBuffer: string;
  navigateTo: (pageNumber: number) => void;
  goNext: () => void;
  goPrevious: () => void;
}

export function useKeyNav(): UseKeyNavReturn {
  const {
    currentPage,
    pageBuffer,
    appendToBuffer,
    clearBuffer,
    setCurrentPage,
    goNext,
    goPrevious,
  } = usePagesStore();

  const bufferTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetBufferTimeout = useCallback(() => {
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current);
    }
    bufferTimeoutRef.current = setTimeout(() => {
      clearBuffer();
    }, BUFFER_TIMEOUT_MS);
  }, [clearBuffer]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle digit keys (0-9)
      if (/^[0-9]$/.test(event.key)) {
        appendToBuffer(event.key);
        resetBufferTimeout();
        return;
      }

      // Handle arrow keys for navigation
      switch (event.key) {
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrevious();
          break;
        case 'Escape':
          clearBuffer();
          break;
      }
    },
    [appendToBuffer, resetBufferTimeout, goNext, goPrevious, clearBuffer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  return {
    currentPage,
    pageBuffer,
    navigateTo: setCurrentPage,
    goNext,
    goPrevious,
  };
}
