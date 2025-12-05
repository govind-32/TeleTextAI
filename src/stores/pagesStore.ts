import { create } from 'zustand';
import { getValidPageNumbers, DEFAULT_PAGE } from '../registry';

// Valid page numbers from the registry
export const VALID_PAGES = getValidPageNumbers();

export interface PagesState {
  currentPage: number;
  pageHistory: number[];
  pageBuffer: string;
  isTransitioning: boolean;
  setCurrentPage: (page: number) => void;
  appendToBuffer: (digit: string) => void;
  clearBuffer: () => void;
  setTransitioning: (value: boolean) => void;
  goNext: () => void;
  goPrevious: () => void;
}

// DEFAULT_PAGE is imported from registry

export const usePagesStore = create<PagesState>((set, get) => ({
  currentPage: DEFAULT_PAGE,
  pageHistory: [DEFAULT_PAGE],
  pageBuffer: '',
  isTransitioning: false,

  setCurrentPage: (page: number) => {
    const state = get();
    // Only navigate if page is valid and different from current
    if (VALID_PAGES.includes(page) && page !== state.currentPage) {
      set({
        currentPage: page,
        pageHistory: [...state.pageHistory, page],
        pageBuffer: '',
        isTransitioning: true,
      });
      // Reset transitioning after animation
      setTimeout(() => set({ isTransitioning: false }), 300);
    }
  },

  appendToBuffer: (digit: string) => {
    const state = get();
    if (state.pageBuffer.length < 3 && /^[0-9]$/.test(digit)) {
      const newBuffer = state.pageBuffer + digit;
      set({ pageBuffer: newBuffer });
      
      // Auto-navigate when 3 digits are entered
      if (newBuffer.length === 3) {
        const pageNumber = parseInt(newBuffer, 10);
        if (VALID_PAGES.includes(pageNumber)) {
          get().setCurrentPage(pageNumber);
        } else {
          // Invalid page - clear buffer but stay on current page
          set({ pageBuffer: '' });
        }
      }
    }
  },

  clearBuffer: () => set({ pageBuffer: '' }),

  setTransitioning: (value: boolean) => set({ isTransitioning: value }),

  goNext: () => {
    const state = get();
    const currentIndex = VALID_PAGES.indexOf(state.currentPage);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % VALID_PAGES.length;
      get().setCurrentPage(VALID_PAGES[nextIndex]);
    }
  },

  goPrevious: () => {
    const state = get();
    const currentIndex = VALID_PAGES.indexOf(state.currentPage);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + VALID_PAGES.length) % VALID_PAGES.length;
      get().setCurrentPage(VALID_PAGES[prevIndex]);
    }
  },
}));
