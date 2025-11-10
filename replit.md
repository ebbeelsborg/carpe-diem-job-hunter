# Interview Prep Tracker

## Overview

The Interview Prep Tracker is a full-stack web application designed to help job seekers manage their interview preparation process. It provides a centralized platform to track job applications, schedule interviews, organize learning resources, and maintain a question bank. The application features a clean, productivity-focused design inspired by Linear and Notion, emphasizing efficient data management and professional polish.

**Core Purpose**: Streamline the job search process by providing tools to track applications through various stages, prepare for interviews, and organize study materials in one consolidated workspace.

**Tech Stack**: React with TypeScript frontend, Express.js backend, PostgreSQL database via Supabase, Supabase Auth for authentication, Drizzle ORM, TanStack Query for state management, and shadcn/ui component library with Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

**UI/UX Preferences**:
- Application cards use three-dot dropdown menus for actions (Edit, Schedule Interview, Delete) instead of inline buttons - saves space and provides cleaner interface
- Entire application card is clickable to view details
- Interview, resource, and question cards use three-dot dropdown menus for Edit and Delete actions
- Dashboard stat cards have subtle hover highlight effects for better interactivity
- Silent operations: No success toasts after CRUD operations (only error messages shown)
- Edit modals allow in-place editing without page navigation - improved workflow efficiency

## System Architecture

### Frontend Architecture

**Framework & Build**: React 18 with TypeScript, bundled using Vite. The application uses a client-side routing approach with `wouter` for lightweight navigation without full page reloads.

**Component Strategy**: Built on shadcn/ui (Radix UI primitives) providing accessible, customizable components. Custom components are organized by feature (applications, interviews, resources, questions) with shared UI components in a dedicated directory. Edit modals (EditResourceModal, EditQuestionModal) enable in-place editing using react-hook-form with Controller for custom checkbox components. The design system follows a "New York" style variant with consistent spacing, typography, and color tokens.

**State Management**: TanStack Query (React Query) handles server state with automatic caching, background refetching disabled for data stability. Each resource type (applications, interviews, resources, questions) has dedicated query keys enabling granular cache invalidation using predicate functions to match URL prefixes. Edit modals properly clear selected items when closed to prevent stale state. Local UI state managed with React hooks.

**Design System**: Tailwind CSS with custom configuration extending base colors and spacing. CSS variables drive theming (light mode implemented, dark mode structure present). Typography uses Inter/DM Sans for clean, modern aesthetic. Component styling emphasizes subtle shadows, borders, and hover states for depth without visual clutter.

**Routing Strategy**: Seven routes total - two public auth routes and five protected application routes:

Public Routes:
- `/login` - Email/password login page
- `/signup` - User registration with email confirmation

Protected Routes (require authentication):
- `/` - Dashboard with stats overview and recent activity
- `/applications` - Full application management with filtering
- `/interviews` - Interview scheduling and timeline view
- `/resources` - Study materials organized by category
- `/questions` - Interview question bank with search

**Route Protection**: ProtectedRoute component wraps authenticated pages, redirecting unauthenticated users to `/login`. AppLayout conditionally hides sidebar on auth pages.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode. Middleware stack includes JSON body parsing with raw body preservation for webhook compatibility, request logging with duration tracking, and automatic error handling.

**API Design**: RESTful endpoints organized by resource type. All routes are protected with JWT authentication middleware that verifies Supabase Auth tokens and extracts the authenticated user ID. All API routes prefixed with `/api/`.

**Authentication**: JWT-based authentication using Supabase Auth. Middleware at `server/middleware/auth.ts` verifies tokens using the Supabase service role key and injects `userId` into request objects. All endpoints return 401 for unauthenticated requests.

**Storage Layer**: Abstracted through `IStorage` interface in `server/storage.ts`, providing clean separation between business logic and data access. Enables easy testing and potential future storage backend changes.

**Request Lifecycle**: Requests flow through logging middleware → route handlers → storage layer → database. Responses are captured and logged with timing metrics for debugging and performance monitoring.

**Development Setup**: Vite dev server runs in middleware mode for HMR (Hot Module Replacement), serving client assets during development. Production build outputs separate client bundle and server bundle for deployment.

### Data Storage & Schema

**Database**: PostgreSQL via Supabase with connection pooling. Drizzle ORM provides type-safe queries and schema management. Supabase Auth manages user authentication with email/password login and email confirmation.

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

**Security**: All storage operations require `userId` parameter and filter queries by user. PATCH endpoints use partial updates via Drizzle ORM's `.set()` method, safely updating only provided fields. Edit modals send only form fields to backend, preserving non-form database fields like `isReviewed` and `isFavorite`. This ensures multi-tenant data isolation and prevents unintended data overwrites.

### External Dependencies

**UI Component Library**: 
- shadcn/ui with Radix UI primitives - Provides accessible, unstyled components
- Rationale: Customizable without fighting framework opinions, built-in accessibility, TypeScript support

**Database & Authentication Provider**:
- Supabase PostgreSQL - Managed PostgreSQL with built-in authentication
- Supabase Auth - JWT-based authentication with email/password and email confirmation
- Connection pooling via Supabase session pooler (port 5432)
- Rationale: Integrated auth + database solution, automatic user management, secure JWT tokens, email confirmation flow

**Form Management**:
- React Hook Form with Zod resolver - Type-safe form validation
- Controller component for integrating custom UI components (Checkbox) with form state
- Drizzle-Zod integration generates validation schemas from database schema
- Edit modals implement partial updates - only send changed fields to preserve other database values
- Rationale: Reduces boilerplate, ensures form validation matches database constraints, enables safe partial updates

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

**Logo Integration**:
- Clearbit Logo API - Free company logo service
- Automatic logo display on application cards based on job URL or company name
- Domain extraction logic: parses job URLs to extract company domain, falls back to company name + .com
- Graceful fallback: displays Building2 icon if logo fails to load
- No authentication required
- Rationale: Enhances visual recognition of companies, professional appearance, zero configuration

## Authentication Flow

**Implementation**: Supabase Auth with JWT tokens, email/password authentication with email confirmation enabled.

**Frontend Components**:
- `AuthContext` (`client/src/contexts/auth-context.tsx`) - Provides user state and auth functions (signUp, signIn, signOut)
- `ProtectedRoute` (`client/src/components/protected-route.tsx`) - Wrapper component that redirects unauthenticated users to `/login`
- Login/Signup pages with form validation and error handling
- Supabase client configured with public anon key for frontend operations

**Backend Security**:
- Authentication middleware (`server/middleware/auth.ts`) verifies JWT tokens using Supabase service role key
- Service role key enables secure server-side token verification without trusting client credentials
- Middleware extracts `userId` from verified tokens and injects into request objects
- All protected API routes use `authenticateUser` middleware to enforce authentication

**User Flow**:
1. User visits app → redirected to `/login` if not authenticated
2. User clicks "Sign up" → fills email/password form
3. Supabase creates user account and sends confirmation email
4. User receives toast: "Check your email - We sent you a confirmation link"
5. User clicks email confirmation link → Supabase verifies email
6. User returns to `/login` and signs in with credentials
7. Supabase returns JWT session token → stored in AuthContext
8. Protected routes now accessible → sidebar displayed with user email and sign out button
9. All API requests include JWT token in Authorization header
10. Backend middleware verifies token and allows access to user's data

**Security Notes**:
- Frontend uses `VITE_SUPABASE_ANON_KEY` (public, safe to expose)
- Backend uses `SUPABASE_SERVICE_ROLE_KEY` (private, never exposed to frontend)
- Email confirmation required before login (configurable in Supabase dashboard)
- Multi-tenant data isolation: all storage queries filter by authenticated `userId`
- Session persistence disabled on backend to prevent memory leaks