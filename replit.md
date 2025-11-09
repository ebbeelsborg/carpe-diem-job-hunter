# Interview Prep Tracker

## Overview

The Interview Prep Tracker is a full-stack web application designed to help job seekers manage their interview preparation process. It provides a centralized platform to track job applications, schedule interviews, organize learning resources, and maintain a question bank. The application features a clean, productivity-focused design inspired by Linear and Notion, emphasizing efficient data management and professional polish.

**Core Purpose**: Streamline the job search process by providing tools to track applications through various stages, prepare for interviews, and organize study materials in one consolidated workspace.

**Tech Stack**: React with TypeScript frontend, Express.js backend, PostgreSQL database via Neon, Drizzle ORM, TanStack Query for state management, and shadcn/ui component library with Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build**: React 18 with TypeScript, bundled using Vite. The application uses a client-side routing approach with `wouter` for lightweight navigation without full page reloads.

**Component Strategy**: Built on shadcn/ui (Radix UI primitives) providing accessible, customizable components. Custom components are organized by feature (applications, interviews, resources, questions) with shared UI components in a dedicated directory. The design system follows a "New York" style variant with consistent spacing, typography, and color tokens.

**State Management**: TanStack Query (React Query) handles server state with automatic caching, background refetching disabled for data stability. Each resource type (applications, interviews, resources, questions) has dedicated query keys enabling granular cache invalidation. Local UI state managed with React hooks.

**Design System**: Tailwind CSS with custom configuration extending base colors and spacing. CSS variables drive theming (light mode implemented, dark mode structure present). Typography uses Inter/DM Sans for clean, modern aesthetic. Component styling emphasizes subtle shadows, borders, and hover states for depth without visual clutter.

**Routing Strategy**: Five main routes mapped to dedicated pages:
- `/` - Dashboard with stats overview and recent activity
- `/applications` - Full application management with filtering
- `/interviews` - Interview scheduling and timeline view
- `/resources` - Study materials organized by category
- `/questions` - Interview question bank with search

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode. Middleware stack includes JSON body parsing with raw body preservation for webhook compatibility, request logging with duration tracking, and automatic error handling.

**API Design**: RESTful endpoints organized by resource type. Mock user authentication currently using hardcoded user ID (`MOCK_USER_ID`) - authentication infrastructure prepared but not yet implemented. All API routes prefixed with `/api/`.

**Storage Layer**: Abstracted through `IStorage` interface in `server/storage.ts`, providing clean separation between business logic and data access. Enables easy testing and potential future storage backend changes.

**Request Lifecycle**: Requests flow through logging middleware → route handlers → storage layer → database. Responses are captured and logged with timing metrics for debugging and performance monitoring.

**Development Setup**: Vite dev server runs in middleware mode for HMR (Hot Module Replacement), serving client assets during development. Production build outputs separate client bundle and server bundle for deployment.

### Data Storage & Schema

**Database**: PostgreSQL via Neon serverless with WebSocket connection pooling. Drizzle ORM provides type-safe queries and schema management.

**Core Entities**:

1. **Users**: Basic user records with username/password (auth pending implementation)
   - Fields: id, username, password

2. **Applications**: Job application tracking with comprehensive metadata
   - Status flow: applied → phone_screen → technical → onsite → final → offer/rejected/withdrawn
   - Salary range tracking, location, remote flag, application dates
   - Free-form notes field for custom tracking

3. **Interviews**: Scheduled interview details linked to applications
   - Type categorization: phone_screen, technical, system_design, behavioral, final, other
   - Platform tracking (Zoom, Google Meet, on-site)
   - Status: scheduled, completed, cancelled
   - Post-interview capture: notes, questions asked, rating (1-5), follow-up actions

4. **Resources**: Study materials and prep resources
   - Category-based organization: algorithms, system_design, behavioral, company_specific, resume, other
   - Optional linking to specific applications
   - Review status tracking with checkbox

5. **Questions**: Interview question bank with answers
   - Type classification: behavioral, technical, system_design
   - Answer storage with metadata
   - Search and filtering capabilities

**Schema Design Rationale**: Uses UUID primary keys for distributed system compatibility. Foreign keys maintain referential integrity. Enum types enforce valid status/type values at database level. Timestamps track creation for auditing. Nullable fields allow progressive data entry.

**Date Serialization**: Insert schemas use `z.union([z.string(), z.date()]).transform()` to handle JSON date serialization. When dates are sent from frontend to backend via JSON, they become ISO strings. The schema accepts both string and Date types and transforms strings to Date objects before database insertion.

**Migration Strategy**: Drizzle Kit manages schema migrations with `db:push` command. Migration files stored in `migrations/` directory for version control and deployment tracking.

**Security**: All storage operations require `userId` parameter and filter queries by user. PATCH endpoints use field whitelisting to prevent unauthorized updates. This ensures multi-tenant data isolation.

### External Dependencies

**UI Component Library**: 
- shadcn/ui with Radix UI primitives - Provides accessible, unstyled components
- Rationale: Customizable without fighting framework opinions, built-in accessibility, TypeScript support

**Database Provider**:
- Neon Serverless PostgreSQL - Managed PostgreSQL with WebSocket support
- Connection pooling via `@neondatabase/serverless` and `ws` package
- Rationale: Serverless scaling, WebSocket support for edge deployments, PostgreSQL compatibility

**Form Management**:
- React Hook Form with Zod resolver - Type-safe form validation
- Drizzle-Zod integration generates validation schemas from database schema
- Rationale: Reduces boilerplate, ensures form validation matches database constraints

**Styling**:
- Tailwind CSS with PostCSS - Utility-first CSS framework
- Custom configuration extends default theme with project-specific tokens
- Rationale: Rapid UI development, consistent spacing/colors, excellent tree-shaking

**State & Data Fetching**:
- TanStack Query v5 - Server state management
- Rationale: Handles caching, loading states, error handling, optimistic updates with minimal code

**Date Handling**:
- date-fns - Lightweight date manipulation and formatting
- Rationale: Tree-shakeable alternative to Moment.js, functional programming approach

**Development Tools**:
- Replit-specific plugins for dev banner, cartographer, runtime error overlay
- TypeScript with strict mode for type safety
- esbuild for fast server bundling

**Design Resources**:
- Google Fonts CDN for Inter/DM Sans typography
- Lucide React for consistent icon set
- Rationale: Professional typography, comprehensive icon library with React components