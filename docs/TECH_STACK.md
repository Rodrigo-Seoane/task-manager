# Board Master - Technology Stack

## Stack Selection Criteria

- **Simplicity**: Minimize dependencies, avoid over-engineering
- **Speed**: Fast development iteration for MVP
- **Scalability**: Can grow beyond MVP without rewrite
- **Cost**: Free tier sufficient for initial launch
- **Team size**: Optimized for solo developer or small team (2–3 people)

---

## Frontend

### Framework: **Next.js 14 (App Router)**

**Why**:
- React-based (large ecosystem, good hiring pool)
- Built-in routing, API routes, server components
- Excellent mobile-first performance
- SEO-friendly (though less critical for authenticated app)
- Vercel deployment (zero config)

**Alternatives considered**:
- ❌ Create React App: No longer recommended, lacks modern features
- ❌ Remix: Smaller ecosystem, less mature tooling
- ❌ Vue/Nuxt: Great but React has more child-friendly component libraries

### Styling: **Tailwind CSS**

**Why**:
- Rapid prototyping without context switching
- Mobile-first by default
- Small bundle size with purging
- Easy to implement child-safe design tokens (large text, high contrast)

**Alternatives considered**:
- ❌ Styled Components: Runtime overhead, slower dev experience
- ❌ CSS Modules: More boilerplate, harder to enforce design system
- ✅ shadcn/ui: Used in addition for accessible components

### UI Components: **shadcn/ui + Radix UI**

**Why**:
- Copy-paste components (no dependency bloat)
- Built on Radix UI (excellent accessibility)
- Customizable with Tailwind
- Keyboard navigation out of the box

**Key components**:
- Button, Card, Dialog (modals)
- Select, Input, Textarea
- Progress bar
- Avatar, Badge

### State Management: **React Context + Hooks**

**Why**:
- Built-in, no extra dependencies
- Sufficient for MVP scope
- Easy to migrate to Zustand/Redux later if needed

**State structure**:
- `AuthContext`: Tutor/Learner auth state
- `WeeklyCycleContext`: Current active cycle
- `TaskContext`: Task list and completions

### Form Handling: **React Hook Form + Zod**

**Why**:
- Minimal re-renders (better performance)
- Built-in validation with Zod schemas
- TypeScript-first
- Easy error messaging for tutors

**Usage**:
- Tutor signup/login
- Task creation forms
- PIN entry (custom validation)

---

## Backend

### Framework: **Next.js API Routes** (initially)

**Why**:
- Same codebase as frontend
- No CORS issues
- Serverless deployment (scales to zero, cost-efficient)
- Easy to migrate to separate backend later

**Structure**:
```
/app/api/
  /auth/
    /tutor/login
    /tutor/signup
    /learner/login
  /learners/
    /[id]
    /create
  /tasks/
    /[id]
    /complete
  /weekly-cycles/
    /[id]
    /create
    /review
```

### Migration Path (post-MVP):
If app grows beyond 1,000 users, migrate to:
- **Express.js** or **Fastify** (separate Node.js backend)
- **tRPC** for type-safe API calls
- Keep Next.js for frontend only

---

## Database

### Primary: **PostgreSQL** (via Supabase)

**Why**:
- Relational structure fits task/cycle relationships perfectly
- ACID compliance (critical for point calculations)
- JSON columns for flexible metadata (task icons, profile preferences)
- Supabase provides:
  - Hosted Postgres (free tier: 500MB)
  - Auto-generated REST API
  - Real-time subscriptions (future: live progress updates)
  - Built-in auth (can replace custom auth later)

**Schema**:
- 7 core tables (Tutor, Learner, WeeklyCycle, Task, TaskCompletion, plus auth tables)
- Foreign key constraints enforced at DB level
- Indexes on: learner_id, weekly_cycle_id, completion_date

**Alternatives considered**:
- ❌ MongoDB: No strong relational needs, harder to enforce data integrity
- ❌ SQLite: Not suitable for web deployment
- ✅ PlanetScale: Great alternative if Supabase limits hit, same migration path

### ORM: **Prisma**

**Why**:
- Type-safe database queries
- Automatic migrations
- Excellent TypeScript integration
- Built-in connection pooling
- Visual data browser

**Schema definition**:
```prisma
model Tutor {
  id        String   @id @default(uuid())
  email     String   @unique
  learners  Learner[]
}

model Learner {
  id              String   @id @default(uuid())
  tutorId         String
  tutor           Tutor    @relation(fields: [tutorId], references: [id])
  weeklyCycles    WeeklyCycle[]
}
// ... additional models
```

---

## Authentication

### Strategy: **NextAuth.js** (Auth.js v5)

**Why**:
- Built for Next.js
- Supports custom credential-based auth (tutor email/password, learner PIN)
- Session management out of the box
- JWT or database sessions
- Easy to add OAuth later (Google sign-in for tutors)

**Auth Flows**:
1. **Tutor Auth**:
   - Email + password
   - JWT stored in httpOnly cookie
   - Session expires after 30 days

2. **Learner Auth**:
   - PIN-based (4 digits)
   - No email/password
   - Tied to tutor account
   - Session expires after 24 hours (re-enter PIN daily)
   - Rate limiting (5 attempts, 30-min lockout)

**Security**:
- bcrypt for password hashing (cost factor: 10)
- CSRF protection (built into NextAuth)
- Rate limiting via middleware (10 req/min per IP for auth endpoints)

---

## Hosting & Deployment

### Platform: **Vercel**

**Why**:
- Zero-config Next.js deployment
- Automatic HTTPS
- Edge network (fast globally)
- Preview deployments (per PR)
- Free tier: 100GB bandwidth, unlimited requests
- Environment variables management

**Deployment flow**:
1. Push to `main` branch
2. Vercel auto-deploys to production
3. Push to feature branch → preview URL

**Custom domain**:
- `boardmaster.app` (example)
- Configured via Vercel DNS

### Database Hosting: **Supabase**

**Why**:
- Free tier sufficient for MVP (500MB storage, 2GB bandwidth)
- Hosted in AWS (reliable)
- Automatic backups
- Direct Postgres access (for migrations)

---

## Additional Tools

### Development
- **TypeScript**: Type safety across entire stack
- **ESLint + Prettier**: Code quality and formatting
- **Husky**: Pre-commit hooks (lint, type check)
- **pnpm**: Fast, disk-efficient package manager

### Monitoring (Post-MVP)
- **Sentry**: Error tracking (free tier: 5k errors/month)
- **Vercel Analytics**: Page views and performance
- **Supabase Logs**: Database query monitoring

### Testing (Post-MVP)
- **Vitest**: Unit tests (faster than Jest)
- **Playwright**: E2E tests for critical flows
- **React Testing Library**: Component tests

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..." # Generated random string

# Supabase (optional, if using Supabase auth)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..." # Server-only
```

---

## Project Folder Structure

```
board-master/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/             # Auto-generated migrations
│   └── seed.ts                 # Sample data for dev
├── docs/                       # All specification documents
│   ├── PRODUCT_SPEC.md
│   ├── DATA_MODELS.md
│   ├── GAMIFICATION_RULES.md
│   ├── USER_FLOWS.md
│   ├── SCREEN_STRUCTURE.md
│   ├── NARRATIVE_SYSTEM.md
│   ├── TECH_STACK.md
│   └── IMPLEMENTATION_PLAN.md
├── public/
│   ├── icons/                  # Task icons (SVG)
│   ├── wizard/                 # Tony Stark character images
│   └── sounds/                 # Optional task completion sounds
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── tutor/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── learners/page.tsx
│   │   │   ├── weekly-tasks/[learnerId]/page.tsx
│   │   │   └── review/[cycleId]/page.tsx
│   │   ├── learner/
│   │   │   ├── select/page.tsx
│   │   │   ├── pin/page.tsx
│   │   │   └── dashboard/page.tsx
│   │   └── api/                # API routes
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts
│   │       │   └── learner/login/route.ts
│   │       ├── learners/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── tasks/
│   │       │   ├── route.ts
│   │       │   ├── [id]/route.ts
│   │       │   └── complete/route.ts
│   │       └── weekly-cycles/
│   │           ├── route.ts
│   │           ├── [id]/route.ts
│   │           └── review/route.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── progress.tsx
│   │   ├── tutor/              # Tutor-specific components
│   │   │   ├── LearnerCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── WeeklyReview.tsx
│   │   │   └── ProfileSelector.tsx
│   │   ├── learner/            # Learner-specific components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── BossTaskCard.tsx
│   │   │   ├── WizardMessage.tsx
│   │   │   └── PinPad.tsx
│   │   └── shared/             # Shared components
│   │       ├── Logo.tsx
│   │       ├── Navigation.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth config
│   │   ├── validations.ts      # Zod schemas
│   │   └── utils.ts            # Helper functions
│   ├── hooks/
│   │   ├── useAuth.ts          # Auth context hook
│   │   ├── useWeeklyCycle.ts   # Current cycle hook
│   │   └── useTasks.ts         # Task operations hook
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── WeeklyCycleContext.tsx
│   ├── types/
│   │   ├── index.ts            # Shared TypeScript types
│   │   └── api.ts              # API request/response types
│   ├── constants/
│   │   ├── gamification.ts     # Level 1 rules, point values
│   │   ├── profile-types.ts    # Profile type definitions
│   │   └── narrative.ts        # Wizard messages
│   └── styles/
│       └── globals.css         # Global styles + Tailwind imports
├── .env.local                  # Local environment variables (gitignored)
├── .env.example                # Template for required env vars
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

---

## Development Workflow

### Initial Setup
```bash
# Clone repo
git clone <repo-url>
cd board-master

# Install dependencies
pnpm install

# Setup database
pnpm prisma migrate dev
pnpm prisma db seed

# Start dev server
pnpm dev
```

### Key Commands
```bash
pnpm dev          # Start Next.js dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm type-check   # TypeScript type checking
pnpm prisma studio # Open Prisma Studio (DB GUI)
```

### Database Migrations
```bash
# Create migration after schema change
pnpm prisma migrate dev --name add_boss_task_field

# Apply migrations to production
pnpm prisma migrate deploy

# Reset database (dev only)
pnpm prisma migrate reset
```

---

## Scaling Considerations

### MVP → 100 Users
- Current stack sufficient
- No changes needed
- Free tiers cover usage

### 100 → 1,000 Users
- Upgrade Supabase to $25/month plan
- Add Redis for session caching (Upstash free tier)
- Enable Vercel Pro ($20/month for better analytics)

### 1,000 → 10,000 Users
- Migrate API routes to separate backend (Express/Fastify)
- Add read replicas for database
- Implement background job queue (BullMQ)
- Add CDN for static assets (Cloudflare)

### 10,000+ Users
- Kubernetes deployment (or stick with Vercel + scale DB)
- Separate microservices for task completion (high traffic)
- Implement caching layer (Redis Cluster)
- Add monitoring and alerting (Datadog, PagerDuty)

**Note**: MVP architecture supports clean migration path at each stage without rewrites.

---

## Cost Estimates

### MVP (0–100 users)
- Hosting: **$0** (Vercel free tier)
- Database: **$0** (Supabase free tier)
- Domain: **$12/year** (boardmaster.app)
- **Total: $1/month**

### Growth (100–1,000 users)
- Hosting: **$20/month** (Vercel Pro)
- Database: **$25/month** (Supabase Pro)
- Caching: **$0** (Upstash free tier)
- **Total: $45/month**

### Scale (1,000–10,000 users)
- Hosting: **$50/month** (Vercel Enterprise or self-hosted)
- Database: **$200/month** (Supabase Pro + storage)
- Caching: **$50/month** (Upstash Pro)
- Monitoring: **$30/month** (Sentry + Vercel Analytics)
- **Total: $330/month**
