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

## Blog Module

- **Database**: `blog_posts` table with title, slug, excerpt, content, coverImage, specialization, tags, status (draft/published), authorName, readingTimeMinutes, publishedAt
- **Public pages**: `/blog` (listing with grid cards), `/blog/:slug` (article with prose styling via @tailwindcss/typography)
- **Admin endpoints**: CRUD at `/api/admin/blog` (protected by isAdmin), auto-slug generation from Polish titles
- **SEO**: BlogPosting JSON-LD schema, BreadcrumbSchema, meta tags, sitemap integration
- **Navigation**: Blog link in main nav and footer "Kategorie" section

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

**January 2026 - Monetization Features**
- Sponsored placements: Events with active placement display "Promowane" badge with mint gradient, sorted first in listings
- Analytics tracking: /api/track endpoint records pageViews, registrationClicks, calendarAdds, shares per event
- Lead capture: Enhanced leads table with eventTitle, eventDate, eventWebsite, organizerName fields
- Stripe integration: Payment processing for promotion packages (Basic 199 PLN, Pro 499 PLN, Max 999 PLN)
- PromotePage: Package selection with Stripe checkout and lead capture fallback

**January 2026 - Geographic Filtering & New Specializations**
- Geographic filtering: city and voivodeship columns on events table
- Location filters in FiltersPanel: 16 voivodeships, 20 major Polish cities

**January 2026 - Expanded Specializations (40+ Categories)**
- Expanded from 18 to 43 medical specializations organized into 6 categories:
  - **Chirurgiczne (13)**: general_surgery, orthopedics, gynecology, urology, neurosurgery, vascular_surgery, cardiac_surgery, pediatric_surgery, plastic_surgery, maxillofacial_surgery, ophthalmology, otolaryngology, thoracic_surgery
  - **Zachowawcze (16)**: internal_medicine, pediatrics, family_medicine, cardiology, neurology, gastroenterology, pulmonology, endocrinology, nephrology, rheumatology, hematology, oncology, diabetology, geriatrics, emergency_medicine, anesthesiology
  - **Psychiatryczne (3)**: psychiatry, child_psychiatry, sexology
  - **Diagnostyczne (4)**: radiology, laboratory_medicine, pathology, nuclear_medicine
  - **Inne (7)**: dermatology, allergology, infectious_diseases, occupational_medicine, sports_medicine, palliative_medicine, rehabilitation
- Enhanced AI extractor with comprehensive SPECIALIZATION_KEYWORDS for accurate categorization
- Updated EXCLUSIVE_KEYWORDS to prevent cross-specialization drift
- Comprehensive SEO data for all specializations (meta tags, topics, FAQs, societies)
- Updated color scheme: specialty-specific Tailwind colors by category

**January 2026 - Social Media Graphics Generator**
- Admin panel feature for creating shareable event cards
- Formats: Facebook (1200x630px), Instagram Post (1080x1080px), Instagram Stories (1080x1920px)
- Fabric.js canvas editor with 8 gradient/solid backgrounds
- AI-powered Polish post text and hashtag generation via OpenAI GPT-4.1-mini
- Visual editor with title, date, location fields, font selection, promotion badge toggle
- High-DPI JPG export (2x scale) and Web Share API integration
- Endpoint: POST /api/events/:id/social-copy for AI content generation
- Component: SocialGraphicEditorModal.tsx (integrated in Admin panel)

**January 2026 - Comprehensive SEO Optimization**
- Dynamic meta tags: SEOHead component updates title, description, canonical, keywords, OG/Twitter for each page
- JSON-LD structured data: Event, EventList, Breadcrumb, FAQ, Website schemas
- Sitemap.xml endpoint with homepage (1.0), calendar (0.8), 43 specializations (0.9), up to 500 events (0.7)
- robots.txt with proper directives (Allow /, Disallow /admin, /api/, /promote)
- SEO-friendly URLs: /wydarzenia/{id} for events, /specjalizacja/{slug} for specializations, /calendar for calendar
- Specialization hub pages with unique content, FAQs, related events, meta tags
- Open Graph and Twitter Card tags for social sharing
- Target keywords: "konferencje medyczne", "kongresy lekarskie", "szkolenia medyczne", "webinary dla lekarzy"
- Proper H1-H6 heading hierarchy on all pages

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
- `POST /api/sources/:id/scan` - Trigger single source scan
- `POST /api/sources/scan-all` - Trigger scan of ALL active sources (admin only)
- `GET /api/calendar/:eventId.ics` - Download ICS file

## Admin Panel Features

- **Manual Source Refresh**: Admin panel has "Odśwież wszystkie źródła" button in Źródła tab to manually trigger scanning all sources
- Events from scans are added with status "pending" for admin review before publishing
- Background scheduler also runs every 6 hours automatically

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