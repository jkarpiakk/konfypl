# Design Guidelines: Medical Neo-Mint Design System

## Design Philosophy
- **Light mode only** - Optimized for long reading sessions
- **Clean, calm, medical-professional** aesthetic
- **High readability** with clear visual hierarchy
- **Zero visual noise** - Scannable and fast
- **Modern but conservative** - Appropriate for medical professionals

## Color System

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Neo-Mint | #2ED3B7 | Primary actions, links, focus states |
| Neo-Mint Hover | #25B9A1 | Hover states for primary elements |
| Accent Yellow | #FACC15 | CTAs, highlights, important notices |
| Accent Hover | #EAB308 | Hover states for accent elements |

### Backgrounds
| Color | Hex | Usage |
|-------|-----|-------|
| Background | #F8FAFC | Main page background |
| Surface | #FFFFFF | Cards, modals, elevated surfaces |
| Surface Subtle | #F1F5F9 | Secondary backgrounds, sidebar |

### Text Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Text Primary | #0F172A | Headings, important text |
| Text Secondary | #475569 | Body text, descriptions |
| Text Muted | #64748B | Captions, metadata, placeholders |

### Borders & Dividers
| Color | Hex | Usage |
|-------|-----|-------|
| Border | #E2E8F0 | Card borders, dividers, inputs |
| Focus Ring | #2ED3B7 | Focus states, active elements |

## Typography

### Font Families
- **Headings**: Manrope (weight 500-700)
- **Body**: Inter (weight 400-600)
- **Code**: JetBrains Mono

### Font Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 40px (2.5rem) | 700 | 1.25 |
| H2 | 32px (2rem) | 600 | 1.25 |
| H3 | 24px (1.5rem) | 600 | 1.25 |
| H4 | 20px (1.25rem) | 500 | 1.25 |
| Body | 16px (1rem) | 400 | 1.6 |
| Small | 14px (0.875rem) | 400 | 1.5 |
| Caption | 12px (0.75rem) | 400 | 1.4 |

## Component Specifications

### Event Cards
- Background: White (#FFFFFF)
- Border: 1px solid #E2E8F0
- Border radius: 16px
- Padding: 20px-24px
- Shadow: Subtle card shadow
- Hover: Mint border (#2ED3B7), slight lift, enhanced shadow

### Buttons

#### Primary (Pill CTA)
- Background: #2ED3B7
- Text: #0F172A
- Border radius: 9999px (pill)
- Padding: 10px 24px
- Hover: #25B9A1
- Focus: 2px mint ring with offset

#### Secondary (Outline)
- Background: Transparent
- Text: #2ED3B7
- Border: 1px solid #2ED3B7
- Border radius: 9999px
- Hover: 10% mint background

#### Ghost
- Background: Transparent
- Text: #475569
- Hover: #F1F5F9 background

### Badges

| Type | Background | Text | Border |
|------|------------|------|--------|
| Online | #CCFBF1 | #0F766E | #99F6E4 |
| On-site | #F1F5F9 | #475569 | #E2E8F0 |
| Free | #DCFCE7 | #166534 | #BBF7D0 |
| Paid | #FEF3C7 | #92400E | #FDE68A |
| Points | #FEF9C3 | #854D0E | #FEF08A |
| Specialization | #E6FAF7 | #0F766E | #99F6E4 |

### Inputs
- Background: White
- Border: 1px solid #E2E8F0
- Border radius: 8px
- Padding: 10px 14px
- Focus: Mint ring (#2ED3B7)
- Placeholder: #64748B

### Navigation
- Background: White with subtle border-bottom
- Height: 64px
- Logo: Mint accent
- Links: #475569, hover #2ED3B7
- Active: Mint background pill

## Layout & Spacing

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Container
- Max width: 1280px
- Padding: 16px (mobile), 24px (tablet+)

### Grid
- Cards: 1 column mobile, 2 columns tablet, 3 columns desktop
- Gap: 24px

## UX Guidelines

### Visual Hierarchy
1. Date and time (most scannable)
2. Event title
3. Specialization badges
4. Location/format
5. Price and points
6. CTA buttons

### Interactions
- Hover: Subtle elevation and mint border
- Focus: Clear mint ring
- Active: Slight scale down (0.98)
- Transitions: 150-200ms ease-out

### Empty States
- Icon: Muted color
- Message: Clear and helpful
- Action: Primary CTA to resolve

### Loading States
- Skeleton: Pulse animation
- Match layout of loaded content

## Accessibility
- WCAG 2.1 AA compliant
- Minimum contrast ratio: 4.5:1
- Focus indicators visible
- Touch targets: 44px minimum
- Screen reader friendly labels
