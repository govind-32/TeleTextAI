# Implementation Plan

- [x] 1. Set up project structure and core dependencies





  - Initialize Vite + React + TypeScript project
  - Install dependencies: zustand, fast-check, vitest, @testing-library/react
  - Configure Tailwind CSS with custom teletext color palette
  - Set up project directory structure per design spec
  - Add pixel font assets and audio files to public folder
  - _Requirements: 1.1, 1.2_

- [x] 2. Implement core teletext rendering system




  - [x] 2.1 Create TeletextViewport component with 40x25 grid


    - Implement CSS grid layout for character cells
    - Apply pixel font styling and base colors
    - _Requirements: 1.1, 1.2_
  - [ ]* 2.2 Write property test for text line wrapping
    - **Property 8: Text Line Wrapping**
    - **Validates: Requirements 8.3**
  - [x] 2.3 Create CRTOverlay component with scanlines and vignette


    - Implement scanline repeating gradient
    - Add vignette radial gradient effect
    - Support intensity prop for adjustable effects
    - _Requirements: 1.3_
  - [x] 2.4 Create Glitch effect component for page transitions


    - Implement CSS transform and hue-rotate animations
    - Trigger on page change events
    - _Requirements: 1.4_
  - [x] 2.5 Create PageShell wrapper component


    - Add consistent header with page number and title
    - Integrate glitch effect on mount
    - _Requirements: 1.4_

- [x] 3. Implement state management and navigation





  - [x] 3.1 Create uiStore with Zustand


    - Implement crtIntensity, volume, theme state
    - Add localStorage persistence middleware
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [ ]* 3.2 Write property test for settings persistence
    - **Property 10: Settings Round-Trip Persistence**
    - **Validates: Requirements 9.3, 9.4**
  - [x] 3.3 Create pagesStore with Zustand


    - Implement currentPage, pageBuffer, pageHistory state
    - Add page transition logic
    - _Requirements: 2.1, 2.2_

  - [x] 3.4 Implement useKeyNav hook

    - Handle digit key accumulation into page buffer
    - Handle arrow key navigation (next/previous page)
    - Clear buffer on timeout (3 seconds)
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]* 3.5 Write property tests for navigation
    - **Property 1: Page Buffer Accumulation**
    - **Property 2: Sequential Page Navigation**
    - **Property 3: Invalid Page Rejection**
    - **Validates: Requirements 2.1, 2.3, 2.5**

  - [x] 3.6 Implement useTeletext hook

    - Add formatText function for line wrapping at 40 chars
    - Add playSound function for audio feedback
    - _Requirements: 2.4, 8.3_

- [x] 4. Implement cache and service layer





  - [x] 4.1 Create CacheService with localStorage and TTL


    - Implement get/set/clear/isExpired methods
    - Support configurable TTL per cache entry
    - _Requirements: 4.3, 5.4, 6.3_

  - [x] 4.2 Create LLMService for OpenAI integration

    - Implement summarizeHeadlines method
    - Implement generatePixelArt method
    - Implement chat method for assistant
    - Add error handling with ApiResult pattern
    - _Requirements: 4.1, 7.2, 8.2_

  - [x] 4.3 Create WeatherService for OpenWeatherMap

    - Implement getCurrentWeather method
    - Implement getHourlyForecast method
    - Integrate with CacheService (10 min TTL)
    - _Requirements: 5.2, 5.4_
  - [x] 4.4 Create CryptoService for CoinGecko


    - Implement getTopCoins method
    - Integrate with CacheService (5 min TTL)
    - _Requirements: 6.1, 6.3_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement page components





  - [x] 6.1 Create HomePage (page 100)


    - Display grid of available page tiles
    - Show navigation instructions
    - Set as default page on app load
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 6.2 Create HeadlinesPage (page 101)

    - Fetch headlines via LLMService
    - Render up to 6 headlines with title, snippet, source
    - Handle loading and error states
    - _Requirements: 4.1, 4.2, 4.4_
  - [ ]* 6.3 Write property test for headlines rendering
    - **Property 4: Headlines Rendering Completeness**
    - **Validates: Requirements 4.2**
  - [x] 6.4 Create WeatherPage (page 102)


    - Add city input field
    - Fetch and display weather data
    - Render temperature and conditions with pixel icons
    - Handle loading and error states
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  - [ ]* 6.5 Write property test for weather rendering
    - **Property 5: Weather Data Rendering Completeness**
    - **Validates: Requirements 5.3**
  - [x] 6.6 Create CryptoPage (page 103)


    - Fetch top 5 coins via CryptoService
    - Display coin name, price, 24h change in teletext rows
    - Handle loading and error states
    - _Requirements: 6.1, 6.2, 6.4_
  - [ ]* 6.7 Write property test for crypto rendering
    - **Property 6: Crypto Data Rendering Completeness**
    - **Validates: Requirements 6.2**

  - [x] 6.8 Create PixelArtPage (page 105)

    - Add prompt input field
    - Send prompt to LLMService for 8x8 art generation
    - Render 8x8 pixel grid with teletext blocks
    - Handle loading and error states
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 6.9 Write property test for pixel art grid






    - **Property 7: Pixel Art Grid Structure**
    - **Validates: Requirements 7.3**

  - [x] 6.10 Create AssistantPage (page 199)

    - Add query input field
    - Send queries to LLMService chat method
    - Render responses with 40-char line wrapping
    - Display 2-3 suggested follow-ups
    - Handle loading and error states
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [ ]* 6.11 Write property test for assistant response
    - **Property 9: Assistant Response Rendering**
    - **Validates: Requirements 8.3, 8.4**
  - [x] 6.12 Create SettingsPage (page 900)


    - Add CRT intensity slider control
    - Add volume slider control
    - Persist changes to localStorage via uiStore
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 7. Implement page registry and routing






  - [x] 7.1 Create PAGE_REGISTRY constant with all page definitions

    - Map page numbers to components
    - Include page titles and categories
    - _Requirements: 2.2, 3.2_
  - [x] 7.2 Wire up App.tsx with viewport and page routing


    - Render TeletextViewport with CRT overlay
    - Route to correct page based on pagesStore.currentPage
    - Initialize keyboard listeners via useKeyNav
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. Implement accessibility features






  - [x] 8.1 Add keyboard focus navigation

    - Ensure Tab key navigates between interactive elements
    - Add visible focus indicators with teletext styling
    - Support Enter key activation
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 9. Implement responsive layout






  - [x] 9.1 Add responsive breakpoints for viewport scaling

    - Full size at 1024px+
    - Proportional scaling at 768-1023px
    - Small screen message below 768px
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 10. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
