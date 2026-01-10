# Board Master MVP

A gamified task manager for children aged 6-9, designed to help build healthy habits and routines through engaging gameplay mechanics and a supportive tutor-learner relationship.

## 🎯 Project Overview

Board Master is a simplified MVP that focuses on:
- **Habit formation** over entertainment addiction
- **Weekly task cycles** with clear completion goals
- **Count-based progress** ("8 of 10 tasks done") for child comprehension
- **Boss Task unlock system** at 80% completion threshold
- **Tutor oversight** with weekly review and approval
- **Tony Stark wizard** narrative for guidance

## 🏗️ Current Status

**Phase 1: Foundation** - ✅ COMPLETE

- Database schema with simplified models
- Dual authentication (Tutor email/password + Learner PIN)
- Count-based progress calculations
- Child-safe design system
- Prisma ORM with PostgreSQL adapter

**Phase 2: Tutor Onboarding** - 📋 NEXT

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for full roadmap.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- No external database needed (uses local Prisma Postgres)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rodrigo-Seoane/task-manager.git
cd task-manager

# Install dependencies
npm install

# Start local Prisma Postgres database
npx prisma dev --name board-master-dev
```

In a new terminal:

```bash
# Run database migrations
npx prisma migrate dev

# Start development server
PORT=3002 npm run dev
```

Open [http://localhost:3002](http://localhost:3002) to view the app.

### Verify Installation

Test database connection:
```bash
curl http://localhost:3002/api/test
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "database": {
    "tutors": 0,
    "learners": 0,
    "weeklyCycles": 0,
    "tasks": 0
  }
}
```

## 📁 Project Structure

```
task-manager/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   └── test/         # Database connection test
│   ├── globals.css       # Child-safe design tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── docs/                  # Comprehensive documentation
│   ├── PRODUCT_SPEC.md           # Feature specifications
│   ├── DATA_MODELS.md            # Database schema details
│   ├── GAMIFICATION_RULES.md     # Game mechanics
│   ├── USER_FLOWS.md             # User interactions
│   ├── SCREEN_STRUCTURE.md       # UI/UX design
│   ├── NARRATIVE_SYSTEM.md       # Tony Stark wizard
│   ├── TECH_STACK.md             # Technology choices
│   ├── IMPLEMENTATION_PLAN.md    # 18-20 day timeline
│   ├── CRITICAL_REVIEW.md        # Simplification rationale
│   ├── MVP_CHANGES_SUMMARY.md    # All applied changes
│   └── PHASE_1_TEST_RESULTS.md   # Testing verification
├── lib/                   # Core utilities
│   ├── prisma.ts         # Database client (with adapter)
│   ├── auth.ts           # NextAuth setup
│   ├── auth.config.ts    # Dual authentication config
│   ├── constants.ts      # Game rules and limits
│   └── progress.ts       # Count-based calculations
├── prisma/
│   ├── schema.prisma     # Simplified database schema
│   └── migrations/       # Database migration history
├── types/
│   └── next-auth.d.ts    # TypeScript extensions
└── .env                  # Environment configuration
```

## 🎮 Key Features (Simplified MVP)

### What's Included

✅ **No Profile Types** - All learners use the same simplified interface
✅ **Count-Based Progress** - "8 of 10 tasks done" instead of percentages
✅ **Fixed Point Values** - Always 10 points per regular task
✅ **Task Locking** - No mid-week editing after activation
✅ **"Copy Last Week"** - One-click task duplication
✅ **Frequency Dots** - Visual indicators (● ● ○) for task frequency
✅ **Expectation Field** - "What does done look like?" for clarity
✅ **Boss Task System** - Unlocks at 80% completion by count

### What's NOT Included (By Design)

❌ Profile types (Sentinel/Explorer/Diplomat/Analyst)
❌ Task type complexity (Habit vs Activity)
❌ Custom point values
❌ Mid-week task editing
❌ Level display in UI
❌ Push notifications (email only)

See [docs/MVP_CHANGES_SUMMARY.md](docs/MVP_CHANGES_SUMMARY.md) for rationale.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Prisma Postgres, Prisma ORM 7
- **Authentication**: NextAuth.js (tutor + learner modes)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Hosting**: Vercel (planned)

## 📊 Database Schema (Simplified)

### Core Models

**Tutor**: id, email, password_hash, full_name
**Learner**: id, tutor_id, display_name, pin_code, total_points *(no profile_type, no current_level)*
**WeeklyCycle**: id, learner_id, start_date, end_date, status
**Task**: id, weekly_cycle_id, title, icon_name, point_value *(fixed: 10 or 0)*, frequency_per_week, is_boss_task, expectation
**TaskCompletion**: id, task_id, learner_id, completed_at, tutor_approved, points_awarded

See [docs/DATA_MODELS.md](docs/DATA_MODELS.md) for details.

## 🎯 Game Rules

- **Max Weekly Tasks**: 12 regular + 2 boss tasks
- **Boss Unlock**: 80% of regular tasks completed (by count)
- **Points**: 10 per regular task, 0 per boss task (fixed)
- **Weekly Cycle**: Monday-Sunday
- **Auto-Review**: After 2 days if tutor doesn't review
- **Max Learners**: 4 per tutor

See [docs/GAMIFICATION_RULES.md](docs/GAMIFICATION_RULES.md) for mechanics.

## 🧪 Development

### Useful Commands

```bash
# Database management
npx prisma studio              # Open database GUI
npx prisma migrate status      # Check migration status
npx prisma migrate dev         # Create and apply migration
npx prisma generate            # Regenerate Prisma Client

# Development
npm run dev                    # Start dev server (port 3002)
npm run build                  # Production build
npm run lint                   # Run ESLint

# Testing
curl http://localhost:3002/api/test  # Test DB connection
```

### Environment Variables

Required in `.env`:
```bash
DATABASE_URL="postgres://postgres:postgres@localhost:51217/template1?sslmode=disable"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3002"
```

## 📚 Documentation

All project documentation is in the [docs/](docs/) folder:

- **Product**: [PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)
- **Data**: [DATA_MODELS.md](docs/DATA_MODELS.md), [GAMIFICATION_RULES.md](docs/GAMIFICATION_RULES.md)
- **UX**: [USER_FLOWS.md](docs/USER_FLOWS.md), [SCREEN_STRUCTURE.md](docs/SCREEN_STRUCTURE.md)
- **Implementation**: [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md), [TECH_STACK.md](docs/TECH_STACK.md)
- **Testing**: [PHASE_1_TEST_RESULTS.md](docs/PHASE_1_TEST_RESULTS.md)

## 🔐 Security

- All passwords hashed with bcryptjs
- Learner PINs are 4 digits (consider hashing in production)
- Environment variables for sensitive data
- NextAuth JWT sessions (30-day expiry)
- Foreign key constraints with CASCADE delete

## 🚧 Roadmap

**Current Phase**: Phase 1 (Foundation) - ✅ COMPLETE

**Next Up**: Phase 2 (Tutor Onboarding) - Days 4-5
- Tutor signup/login screens
- Learner profile creation (name + PIN)
- Tutor dashboard
- Tony Stark welcome wizard

**Future Phases**:
- Phase 3: Task Creation (Days 6-7)
- Phase 4: Learner Experience (Days 8-10)
- Phase 5: Review Flow (Days 11-13)
- Phase 6: Narrative System (Day 14)
- Phase 7: Polish & Refinement (Days 15-16)
- Phase 8: Deployment (Days 17-18)
- Phase 9: Testing (Days 19-20)

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for complete timeline.

## 📝 License

Private project - All rights reserved.

## 👥 Credits

Designed and developed by Rodrigo Seoane with AI assistance from Claude Sonnet 4.5.

---

**Built with ❤️ for kids aged 6-9 to develop healthy habits**
