# Design Guidelines: Polish Medical Events Aggregator

## Design Approach
**Selected System**: Hybrid approach combining Material Design's information density with healthcare platform best practices (inspired by professional medical portals like Medscape, UpToDate)

**Rationale**: Medical professionals require efficient, scannable interfaces with clear information hierarchy. The design prioritizes data density, quick filtering, and professional credibility over visual flair.

## Core Design Principles
1. **Professional Medical Aesthetic**: Clean, trustworthy, and credible
2. **Information Efficiency**: Maximum relevant data with minimal scrolling
3. **Scan-ability**: Doctors need to quickly find relevant events
4. **Accessibility**: WCAG 2.1 AA compliance throughout

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts) - clean, modern, highly legible
- Headings: Inter Semi-Bold/Bold
- Body: Inter Regular
- Data/Metadata: Inter Medium (for dates, locations, tags)

**Hierarchy**:
- Page Titles: text-3xl md:text-4xl font-bold
- Section Headers: text-2xl font-semibold
- Event Titles: text-xl font-semibold
- Subsections: text-lg font-medium
- Body Text: text-base
- Metadata/Labels: text-sm font-medium
- Helper Text: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (tags, badges)
- Standard spacing: p-4, gap-4 (cards, forms)
- Section spacing: p-6, py-8 (content blocks)
- Page margins: p-8, py-12, py-16 (major sections)

**Grid System**:
- Container: max-w-7xl mx-auto px-4 md:px-6
- Event listings: Two-column on desktop (filter sidebar + content), single column mobile
- Filter sidebar: w-64 to w-80 on desktop, collapsible drawer on mobile
- Calendar view: Full-width grid

## Component Library

### Navigation
- **Top Navigation Bar**: Sticky header with logo, main navigation links (Events, Calendar, About), search bar, admin login
- Height: h-16
- Include: Logo left, centered search with icon, right-aligned admin access
- Search bar: Prominent placement, w-full max-w-md with icon prefix

### Event Cards (Primary Component)
**Structure**:
- Border card with subtle elevation
- Padding: p-4 to p-6
- Rounded: rounded-lg
- Hover state: slight elevation increase

**Content Layout** (top to bottom):
1. Header row: Event title + bookmark icon (right)
2. Metadata row: Date range, location/online badge, specialization tags
3. Description: 2-3 lines truncated with "Read more"
4. Footer row: Educational points badge, price badge, "Add to Calendar" button, "View Details" link
5. Source indicator: Small text showing organizer + AI-detected badge if applicable

**Badges/Tags**:
- Rounded-full with px-3 py-1
- Specialization tags: Multiple allowed, wrap to new line
- Event type badges: "Online", "Warsaw", "Kraków", etc.
- Points badge: "PKP: 15 pts" format
- Price: "Free", "Paid", "Unknown"

### Filters Panel
**Structure**:
- Sticky sidebar (desktop) or slide-out drawer (mobile)
- Sections with clear dividers

**Filter Groups**:
1. **Date Range**: Date picker with presets (Today, This Week, This Month, Next 3 Months)
2. **Specialization**: Checkbox list with all 14 specializations + "All" option
3. **Event Type**: Radio buttons (All, On-site, Online)
4. **Price**: Checkboxes (Free, Paid, Unknown)
5. **Educational Points**: Toggle switch
6. **Tags**: Multi-select checkboxes (Webinar, Workshop, Residents, Congress)

**Filter Header**: "Filters" title with "Clear All" link, showing active filter count badge

### Calendar View
- Month grid layout with day cells
- Event indicators: colored dots or count badges per day
- Click day to see event list in sidebar/modal
- Navigation: Previous/Next month arrows, month/year dropdown
- Today highlight with distinct styling

### Event Detail Page
**Layout**:
- Two-column on desktop: Main content (2/3) + sidebar (1/3)
- Single column stack on mobile

**Main Content**:
1. Event title (large)
2. Full description
3. Agenda/Program section (if available)
4. Organizer information

**Sidebar**:
1. Key Details card: Date, time, location, format
2. Registration button (primary CTA)
3. Add to Calendar dropdown (Google/Apple/Outlook options)
4. Educational points info
5. Price information
6. Organizer card with logo/link
7. Share options

### Admin Panel
**Structure**:
- Dashboard layout with sidebar navigation
- Sections: Pending Events, All Events, Sources, Settings

**Pending Events Table**:
- Columns: Title, Detected Date, Source, Specialization, Actions
- Actions: Approve (green), Edit, Reject (red)
- Batch actions toolbar when selecting multiple
- AI confidence score indicator per event

**Source Management**:
- Table of monitored websites/RSS feeds
- Columns: Source name, Type (RSS/Website), Last checked, Status, Actions
- Add new source form with URL, type, check frequency

### Forms
- Input fields: Consistent h-10 to h-12, rounded-md, border styling
- Labels: text-sm font-medium, mb-2
- Error states: Red border, error text below in text-sm
- Select dropdowns: Native styling enhanced with icons
- Date pickers: Calendar popover from input field

## Images

**Hero Section** (Homepage):
Professional medical conference stock photo showing doctors at an educational event - modern conference room setting, professional attire, laptops/presentations visible. The image should convey professionalism and continuing education.
- Height: 60vh on desktop, 40vh mobile
- Overlay: Subtle gradient overlay for text readability
- Content over image: Centered headline "Wszystkie wydarzenia medyczne w Polsce" (All medical events in Poland), subtitle, prominent search bar with blurred background

**No other images needed** - focus on data clarity and functional components.

## Animations
**Minimal approach**:
- Card hover: Subtle elevation transition (150ms)
- Filter panel: Smooth slide-in/out (200ms)
- Loading states: Simple spinner, no elaborate animations
- Page transitions: None - instant navigation

## Key UX Patterns
1. **Event Listing Default View**: Show 20-30 events per page with infinite scroll or pagination
2. **Empty States**: Helpful messaging when no events match filters with "Clear filters" action
3. **Loading States**: Skeleton cards matching event card layout
4. **Mobile First**: Collapsible filters, bottom sheet for calendar export options, thumb-friendly tap targets (min 44px)
5. **Breadcrumbs**: On detail pages showing Home > Events > [Event Title]
6. **Toast Notifications**: For actions (event approved, added to calendar) - top-right position

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (two-column with collapsible sidebar)
- Desktop: > 1024px (full sidebar + content layout)