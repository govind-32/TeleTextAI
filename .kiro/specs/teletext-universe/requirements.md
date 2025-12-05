# Requirements Document

## Introduction

Teletext Universe is a modern reimagining of the classic 1980s teletext system, combining retro UI aesthetics (CRT effects, scanlines, pixel fonts) with contemporary features like AI-powered content, live API data, and an interactive assistant. The application delivers a nostalgic yet functional experience where users navigate numbered pages using keyboard input, each page displaying real-time content rendered in authentic teletext block style.

## Glossary

- **Teletext Viewport**: The main display area that renders content in a fixed 40-column by 25-row grid, mimicking classic teletext displays
- **Page**: A discrete content screen identified by a three-digit number (100-999), following teletext conventions
- **Teletext Block**: A single character cell in the viewport grid, styled with pixel fonts and teletext colors
- **CRT Effect**: Visual overlay simulating cathode-ray tube display characteristics including scanlines, curvature, and vignette
- **Page Buffer**: Temporary storage for digit key presses used to construct page numbers during navigation
- **Glitch Effect**: Brief visual distortion applied during page transitions for authenticity

## Requirements

### Requirement 1

**User Story:** As a user, I want to view content in an authentic teletext-style viewport, so that I can experience the nostalgic aesthetic of 1980s information systems.

#### Acceptance Criteria

1. WHEN the application loads THEN the Teletext Viewport SHALL render a 40-column by 25-row character grid using a pixel/bitmap monospace font
2. WHEN content is displayed THEN the Teletext Viewport SHALL apply the defined color palette (background #080808, primary text #E6D8B0, accents orange/green/red/cyan)
3. WHEN the viewport renders THEN the CRT Effect overlay SHALL display scanlines and vignette effects
4. WHEN a page transition occurs THEN the Teletext Viewport SHALL apply a brief glitch effect with screen blink

### Requirement 2

**User Story:** As a user, I want to navigate between pages using numeric keys, so that I can access different content sections like classic teletext systems.

#### Acceptance Criteria

1. WHEN a user presses digit keys (0-9) THEN the Page Buffer SHALL accumulate digits until a three-digit page number is formed
2. WHEN the Page Buffer contains a valid three-digit page number THEN the system SHALL navigate to that page within 500 milliseconds
3. WHEN a user presses arrow keys THEN the system SHALL navigate to the next or previous page in sequence
4. WHEN a page change occurs THEN the system SHALL play a channel-switch audio sound
5. WHEN an invalid page number is entered THEN the system SHALL display an error message and remain on the current page

### Requirement 3

**User Story:** As a user, I want to view a home page with navigation instructions, so that I can understand how to use the teletext system.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL display page 100 (Home) as the default page
2. WHEN page 100 loads THEN the Home Page SHALL display a grid of available page tiles with their numbers and titles
3. WHEN page 100 loads THEN the Home Page SHALL display navigation instructions for keyboard controls

### Requirement 4

**User Story:** As a user, I want to read AI-generated news headlines, so that I can stay informed with concise summaries in teletext format.

#### Acceptance Criteria

1. WHEN page 101 loads THEN the Headlines Page SHALL request summarized headlines from the LLM service
2. WHEN headlines are received THEN the Headlines Page SHALL display up to 6 headlines with title, snippet, and source in teletext blocks
3. WHEN headline data is fetched THEN the system SHALL cache results in localStorage for 10 minutes to reduce API calls
4. WHEN the LLM service is unavailable THEN the Headlines Page SHALL display a fallback error message

### Requirement 5

**User Story:** As a user, I want to check weather information for a city, so that I can see forecasts rendered in teletext style.

#### Acceptance Criteria

1. WHEN page 102 loads THEN the Weather Page SHALL display an input field for city name entry
2. WHEN a user submits a city name THEN the Weather Page SHALL fetch current and hourly forecast data from OpenWeatherMap API
3. WHEN weather data is received THEN the Weather Page SHALL display temperature and conditions using pixel icons in teletext columns
4. WHEN weather data is fetched THEN the system SHALL cache results in localStorage for 10 minutes
5. WHEN the weather API is unavailable THEN the Weather Page SHALL display a fallback error message

### Requirement 6

**User Story:** As a user, I want to view cryptocurrency prices, so that I can track market data in a retro teletext format.

#### Acceptance Criteria

1. WHEN page 103 loads THEN the Crypto Page SHALL fetch price data for the top 5 cryptocurrencies from CoinGecko API
2. WHEN crypto data is received THEN the Crypto Page SHALL display coin name, current price, and 24-hour change percentage in teletext rows
3. WHEN crypto data is fetched THEN the system SHALL cache results in localStorage for 5 minutes
4. WHEN the CoinGecko API is unavailable THEN the Crypto Page SHALL display a fallback error message

### Requirement 7

**User Story:** As a user, I want to generate pixel art from text prompts, so that I can create retro-style artwork displayed in teletext blocks.

#### Acceptance Criteria

1. WHEN page 105 loads THEN the Pixel Art Page SHALL display an input field for art prompt entry
2. WHEN a user submits a prompt THEN the Pixel Art Page SHALL send the prompt to the LLM service for 8x8 pixel art generation
3. WHEN pixel art data is received THEN the Pixel Art Page SHALL render the 8x8 grid using teletext block characters with appropriate colors
4. WHEN the LLM service is unavailable THEN the Pixel Art Page SHALL display a fallback error message

### Requirement 8

**User Story:** As a user, I want to interact with an AI assistant in teletext format, so that I can ask questions and receive answers styled as teletext blocks.

#### Acceptance Criteria

1. WHEN page 199 loads THEN the Assistant Page SHALL display a text input field for user queries
2. WHEN a user submits a query THEN the Assistant Page SHALL send the query to the LLM service
3. WHEN an LLM response is received THEN the Assistant Page SHALL render the response in teletext blocks with line wrapping at 40 characters
4. WHEN an LLM response is received THEN the Assistant Page SHALL display 2-3 suggested follow-up questions
5. WHEN the LLM service is unavailable THEN the Assistant Page SHALL display a fallback error message

### Requirement 9

**User Story:** As a user, I want to adjust display settings, so that I can customize the CRT effect intensity and audio volume.

#### Acceptance Criteria

1. WHEN page 900 loads THEN the Settings Page SHALL display controls for CRT effect intensity adjustment
2. WHEN page 900 loads THEN the Settings Page SHALL display controls for audio volume adjustment
3. WHEN a user changes a setting THEN the system SHALL persist the setting to localStorage immediately
4. WHEN the application loads THEN the system SHALL restore previously saved settings from localStorage

### Requirement 10

**User Story:** As a user, I want the interface to be keyboard accessible, so that I can navigate and interact without requiring a mouse.

#### Acceptance Criteria

1. WHEN interactive elements are present THEN the system SHALL support keyboard focus navigation using Tab key
2. WHEN a focusable element receives focus THEN the system SHALL display visible focus indicators
3. WHEN a user presses Enter on a focused interactive element THEN the system SHALL activate that element

### Requirement 11

**User Story:** As a user, I want the application to work on desktop and tablet screens, so that I can demo it on various devices.

#### Acceptance Criteria

1. WHEN the viewport width is 1024 pixels or greater THEN the Teletext Viewport SHALL display at full 40x25 grid size
2. WHEN the viewport width is between 768 and 1023 pixels THEN the Teletext Viewport SHALL scale proportionally while maintaining aspect ratio
3. WHEN the viewport width is less than 768 pixels THEN the Teletext Viewport SHALL display a message recommending landscape orientation or larger screen
