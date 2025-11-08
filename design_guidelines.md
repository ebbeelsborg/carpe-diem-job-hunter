# Design Guidelines: Interview Prep Tracker

## Design Approach

**System-Based Approach:** Drawing from Linear's clean productivity aesthetics combined with Notion's organizational clarity. This tracker requires efficiency, data density, and professional polish suitable for a portfolio piece.

**Core Principle:** Information-first design with purposeful visual hierarchy. Every element serves the user's goal: managing job applications efficiently while appearing polished to recruiters viewing the portfolio.

## Typography

**Font System:**
- Primary: Inter or DM Sans via Google Fonts CDN
- Headings: 600-700 weight, tracking-tight
- Body: 400 weight, tracking-normal
- Small text (labels, metadata): 500 weight, text-sm

**Hierarchy:**
- Page titles: text-3xl font-bold
- Section headers: text-xl font-semibold
- Card titles: text-lg font-semibold
- Body text: text-base
- Supporting text: text-sm text-gray-600

## Layout System

**Spacing Primitives:** Use Tailwind units 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6
- Card spacing: gap-6
- Section margins: mb-8 or mb-12
- Tight spacing: gap-2 or gap-4

**Container Strategy:**
- Max-width: max-w-7xl mx-auto
- Page padding: px-6 lg:px-8
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

## Component Library

### Dashboard Stats Cards
Four cards across on desktop, stacked on mobile. Each card displays:
- Large number (text-3xl font-bold)
- Label below (text-sm font-medium)
- Icon in top-right corner
- Subtle border and shadow
- Padding: p-6
- Background: white with border

### Application Cards
**Structure:**
- Company logo/icon in top-left (if available, else colored square with initial)
- Company name: text-lg font-semibold
- Position title: text-base text-gray-700 below company
- Status badge: top-right corner with specified colors
- Metadata row: application date, location icons with text-sm
- Salary range if available: text-sm font-medium
- Action buttons at bottom: "View Details", "Schedule Interview"
- Border-l-4 with status color accent
- Hover: subtle shadow elevation

**Status Color System (as specified):**
- Applied: Blue (border-l-blue-500, bg-blue-50 for badge)
- Phone Screen: Purple (border-l-purple-500, bg-purple-50)
- Technical: Orange (border-l-orange-500, bg-orange-50)
- Onsite/Final: Yellow (border-l-yellow-500, bg-yellow-50)
- Offer: Green (border-l-green-500, bg-green-50)
- Rejected: Red (border-l-red-500, bg-red-50)
- Withdrawn: Gray (border-l-gray-400, bg-gray-50)

### Navigation
**Sidebar (desktop) / Bottom nav (mobile):**
- Icons from Lucide React: Home, Briefcase, Calendar, Book, Lightbulb
- Active state: status color accent with subtle background
- Text labels beside icons (desktop only)
- Width: w-64 on desktop

### Filters & Search
**Sticky bar at top of Applications page:**
- Search input: rounded-lg border with search icon (Lucide)
- Status filter dropdowns: inline with subtle borders
- Clear filters button when active
- Spacing: flex gap-4 items-center

### Interview Timeline
**Dashboard section showing upcoming interviews:**
- Vertical timeline with connecting lines
- Each entry: date/time on left, company/position on right
- Interview type badge
- Time until interview in text-sm text-gray-600
- Max 5 upcoming shown

### Modal Forms
**Add/Edit Application Modal:**
- Large centered modal (max-w-2xl)
- Two-column form layout on desktop
- Grouped fields with subtle section dividers
- Primary action button: full accent color
- Secondary (cancel): ghost button
- Form spacing: gap-6 between sections, gap-4 between fields

### Resources Section
**Card-based layout:**
- Category tabs at top (algorithms, system design, etc.)
- Resource cards with title, URL preview, category badge
- "Mark as reviewed" checkbox
- Link to associated application if applicable
- Grid: grid-cols-1 md:grid-cols-2 gap-4

### Empty States
**When no applications exist:**
- Center illustration or large icon
- Heading: "No applications yet"
- Supporting text explaining action
- Primary CTA button: "Add Your First Application"
- Padding: py-24

### Buttons
**Primary:** Full status color background, white text, rounded-lg, px-6 py-2.5, font-medium
**Secondary:** Border with status color, status color text, same sizing
**Ghost:** No border, gray text, hover shows subtle background

### Badges
- Rounded-full px-3 py-1
- Text-xs font-medium
- Status color backgrounds at 50 opacity, darker text

### Toast Notifications
- Bottom-right positioning
- Icon based on type (checkmark success, X error)
- Auto-dismiss after 3 seconds
- Slide-in animation from right

## Responsive Behavior

**Breakpoints:**
- Mobile: base (< 768px) - single column, bottom nav, stacked stats
- Tablet: md (768px+) - 2 columns for cards, sidebar nav
- Desktop: lg (1024px+) - 3 columns for application cards, full sidebar

**Mobile Optimizations:**
- Stats cards stack vertically
- Application cards full-width with all info visible
- Filters collapse into dropdown menu
- Timeline becomes compact list

## Animations

**Minimal and purposeful:**
- Card hover: subtle shadow transition (duration-200)
- Modal entrance: fade + scale from 95% to 100%
- Status change: brief highlight animation on card
- NO scroll animations, parallax, or decorative motion

## Professional Polish

**Elevation System:**
- Level 1 (cards at rest): shadow-sm
- Level 2 (cards on hover): shadow-md
- Level 3 (modals): shadow-xl
- Borders: border-gray-200

**Consistency:**
- All interactive elements have consistent spacing (p-2 minimum touch target)
- All cards use same border-radius (rounded-lg)
- Icon sizing: 20px (w-5 h-5) for UI, 24px for features

This design creates a professional, data-dense interface that demonstrates both technical skill and UX sensibility—perfect for impressing recruiters while serving as a functional tool.