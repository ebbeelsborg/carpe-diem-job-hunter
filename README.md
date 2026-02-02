# Interview Prep Tracker

A full-stack web application to help job seekers manage their interview preparation process. Track applications, schedule interviews, organize study resources, and maintain a question bank - all in one place.

## Usage
Reach out to me if you want to try it out with a demo account. You can also sign up with your own email.

## Features

- **Application Tracking** - Monitor job applications through every stage (applied, phone screen, technical, onsite, offer, etc.)
- **Interview Scheduling** - Keep track of upcoming interviews with details like type, platform, and interviewer information
- **Resource Organization** - Collect and categorize study materials by topic (algorithms, system design, behavioral, etc.)
- **Question Bank** - Build a searchable library of interview questions and answers
- **Dashboard Overview** - Quick stats and recent activity at a glance
- **Company Logos** - Automatic logo display for better visual recognition

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (email/password with email confirmation)
- **ORM**: Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project set up

### Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DATABASE_URL=your_supabase_database_connection_string

# Vite Frontend Variables (prefix with VITE_)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Session Secret
SESSION_SECRET=your_random_session_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/ebbeelsborg/interview_prep_tracker.git
cd interview_prep_tracker
```

2. Install dependencies
```bash
npm install
```

3. Run database migrations
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Authentication

The application uses Supabase Auth with email/password authentication:

1. **Sign up** - Create an account with your email
2. **Email confirmation** - Check your email and click the confirmation link
3. **Sign in** - Log in with your confirmed credentials
4. **Secure access** - All your data is protected and isolated to your account

## Database Schema

The application uses the following main tables:

- **users** - User accounts (managed by Supabase Auth)
- **applications** - Job application records with company, position, status, salary, location, etc.
- **interviews** - Interview details linked to applications
- **resources** - Study materials and prep resources
- **questions** - Interview question bank with answers

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio to view database

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context providers (auth, etc.)
│   │   ├── lib/         # Utility functions and configuration
│   │   └── pages/       # Application pages/routes
├── server/              # Backend Express server
│   ├── middleware/      # Authentication and other middleware
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Database access layer
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── migrations/          # Database migration files
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
