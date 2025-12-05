# Project Structure

```
src/
├── components/           # React components
│   ├── pages/           # Page components (one per teletext page)
│   │   ├── PageShell.tsx    # Shared page wrapper with header/footer
│   │   ├── HomePage.tsx     # P100
│   │   └── *Page.tsx        # Other pages follow same pattern
│   └── viewport/        # Display components (CRT effects, viewport)
│       ├── TeletextViewport.tsx
│       ├── CRTOverlay.tsx
│       └── Glitch.tsx
├── hooks/               # Custom React hooks
│   ├── useKeyNav.ts     # Keyboard navigation (page numbers, arrows)
│   └── useTeletext.ts   # Teletext utilities (audio, text formatting)
├── services/            # External API integrations
│   ├── CacheService.ts  # localStorage caching with TTL
│   ├── WeatherService.ts
│   ├── CryptoService.ts
│   └── LLMService.ts
├── stores/              # Zustand state stores
│   ├── pagesStore.ts    # Navigation state (current page, buffer, history)
│   └── uiStore.ts       # UI settings (CRT intensity, volume, theme)
├── registry/            # Page registration
│   └── pageRegistry.ts  # Central page number → component mapping
├── types/               # TypeScript type definitions
│   └── index.ts         # All shared types
└── __tests__/           # Test files
    ├── unit/            # Unit tests
    └── properties/      # Property-based tests
```

## Key Patterns

### Page Components
- All pages implement `TeletextPageProps` interface: `{ isActive: boolean; onNavigate: (pageNumber: number) => void }`
- Wrap content in `<PageShell pageNumber={N} title="TITLE">` for consistent header/footer
- Register new pages in `src/registry/pageRegistry.ts`

### Services
- Return `ApiResult<T>` type: `{ success: boolean; data?: T; error?: string }`
- Use `CacheService` for API response caching with TTL
- Export both named functions and service object from each service

### State Management
- `usePagesStore` - navigation state, page transitions
- `useUIStore` - persisted user preferences (uses zustand persist middleware)

### Barrel Exports
- Each folder has an `index.ts` that re-exports public API
- Import from folder path: `import { X } from './services'`
