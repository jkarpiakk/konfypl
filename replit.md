# Konfy.pl - Polish Medical Events Aggregator

## Overview

Konfy.pl is a production-ready web application for doctors in Poland that aggregates medical conferences, congresses, webinars, and educational events. The platform automatically updates using RSS feeds and AI-powered website monitoring (OpenAI API) to extract event data from various sources.

Key capabilities:
- Event aggregation from multiple sources (RSS feeds and web scraping)
- AI-powered content extraction using OpenAI
- Calendar export (ICS, Google Calendar, Outlook)
- Filtering by medical specialization, event type, price, and educational points
- Admin panel for managing events and data sources
- Scheduled scanning (every 48-72 hours)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure with reusable components. Key pages include Home (event listing with filters), CalendarPage (calendar view), EventDetail, and Admin panel.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Scheduling**: node-cron for automated source scanning
- **AI Integration**: OpenAI API for content extraction from web pages

The backend implements a RESTful API pattern with routes for events, sources, and scan management. The scheduler runs periodic scans of configured sources.

### Data Flow
1. Sources (RSS feeds or websites) are configured in the database
2. Scheduler triggers scans based on configured frequency
3. RSS Parser or Web Scraper fetches content
4. AI Extractor (OpenAI) processes web content to identify events
5. Deduplicated events are stored with pending/published status
6. Frontend queries events via REST API

### Key Design Patterns
- **Storage Interface**: `IStorage` interface abstracts database operations, making it testable
- **Modular Integrations**: Replit AI integrations are organized in `server/replit_integrations/` for chat, image generation, and batch processing
- **Shared Schema**: TypeScript types and Drizzle schema definitions shared between frontend and backend via `@shared/` alias

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema defined in `shared/schema.ts`, migrations in `/migrations`

### AI Services
- **OpenAI API**: Used for extracting medical event data from scraped web content
  - Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Model: gpt-image-1 for image generation, chat models for text extraction

### External Libraries
- **cheerio**: HTML parsing for web scraping
- **rss-parser**: RSS feed ingestion
- **axios**: HTTP client for fetching external content
- **date-fns**: Date manipulation with Polish locale support
- **node-cron**: Scheduled task execution

### Frontend Dependencies
- **shadcn/ui**: Pre-built accessible components (Radix UI primitives)
- **react-icons**: Icon set including Google Calendar and Apple icons
- **embla-carousel**: Carousel functionality
- **react-day-picker**: Calendar component

## Recent Changes

**January 2026 - Initial Implementation**
- Complete database schema with events, sources, users, and scan_logs tables
- 14 medical specializations support (cardiology, family_medicine, internal_medicine, etc.)
- Full Polish language interface
- AI-powered event extraction using GPT-4.1
- Admin panel with pending/published event workflow
- Calendar export functionality (Google Calendar, Outlook, Apple ICS)
- Background scheduler running every 6 hours

**January 2026 - UI Redesign: Medical Neo-Mint Design System**
- Implemented premium light-mode only design system
- Color palette: Neo-Mint primary (#2ED3B7), clean backgrounds (#F8FAFC), white cards
- Typography: Manrope for headings, Inter for body text
- 16px border radius on cards with subtle shadows
- Pill-shaped primary CTAs with mint color
- Pastel badge system for status indicators
- Removed dark mode toggle for streamlined experience
- Updated all components (Navigation, HeroSection, EventCard, FiltersPanel, CalendarView, Admin)

**January 2026 - User Authentication & Onboarding**
- Integrated Replit Auth (OIDC) for user login with Google/GitHub/email
- Added users table with specializations array and isAdmin flag
- Implemented onboarding modal for first-time visitors to select medical specializations
- User preferences sync between localStorage and database when authenticated
- Navigation shows login button for guests, avatar dropdown for logged-in users
- Added `/api/user/preferences` endpoints (GET/PATCH) protected by authentication

**January 2026 - Rebrand to Konfy.pl**
- Rebranded from MedEvents.pl to Konfy.pl
- Created KonfyLogo component with "konfy" (dark slate) + ".pl" (neo-mint) wordmark
- Created KonfyIcon component with K lettermark for favicon and app icon
- Updated Navigation, OnboardingModal, meta tags, and all references
- New favicon.svg with K lettermark design
- Color palette: Neo-Mint #2ED3B7, Dark Slate #0F172A, White #FFFFFF
- Typography: Manrope font, semi-bold 600, letter-spacing -0.03em

## Project Structure

```
├── client/src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   ├── FiltersPanel.tsx
│   │   ├── HeroSection.tsx
│   │   └── Navigation.tsx
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Admin.tsx
│   │   ├── EventDetail.tsx
│   │   └── CalendarPage.tsx
│   └── lib/             # Utilities and types
├── server/
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Database operations
│   ├── ai-extractor.ts  # OpenAI event extraction
│   ├── rss-parser.ts    # RSS feed processing
│   ├── web-scraper.ts   # Website content scraping
│   ├── scheduler.ts     # Cron job management
│   └── seed.ts          # Demo data seeding
└── shared/
    └── schema.ts        # Database schema and types
```

## API Endpoints

- `GET /api/events` - List events (filter: ?status=published|pending)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/sources` - List sources
- `POST /api/sources/:id/scan` - Trigger source scan
- `GET /api/calendar/:eventId.ics` - Download ICS file

## Security Notes

**Current Status**: User authentication implemented via Replit Auth (OIDC).

- Users can log in with Google/GitHub/email via Replit Auth
- Session storage in PostgreSQL via connect-pg-simple
- Protected endpoints use isAuthenticated middleware
- User preferences endpoint protected by authentication

**For Production**: Before deploying to production, consider:
1. CSRF mitigation (SameSite=lax + token) for session-based auth
2. Rate limiting for API endpoints
3. Automated tests for admin authorization

## Running the Application

The app starts automatically with `npm run dev` which:
1. Seeds the database with demo data (if empty)
2. Starts the Express server with Vite integration
3. Initializes the scheduler for periodic source scans
4. Serves the frontend on port 5000