# Tech Stack & Build System

## Core Technologies
- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- **Zustand 5** for state management (with persist middleware)

## Testing
- **Vitest** for unit and property-based testing
- **React Testing Library** for component tests
- **fast-check** for property-based testing
- **jsdom** as test environment

## Linting
- **ESLint 9** with TypeScript and React plugins
- `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

## Common Commands
```bash
npm run dev       # Start development server
npm run build     # TypeScript compile + Vite build
npm run lint      # Run ESLint
npm run test      # Run tests once (vitest --run)
npm run test:watch # Run tests in watch mode
npm run preview   # Preview production build
```

## Environment Variables
- `VITE_OPENWEATHER_API_KEY` - OpenWeatherMap API key for weather service
- API keys accessed via `import.meta.env.VITE_*`

## TypeScript Configuration
- Project references: `tsconfig.app.json` (app code), `tsconfig.node.json` (tooling)
- Strict mode enabled
- ES2020 target with ESNext modules
