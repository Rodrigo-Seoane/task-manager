# Board Master - Quick Start Guide

## Development Commands

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Database commands
npx prisma generate       # Generate Prisma Client
npx prisma migrate dev    # Create and apply migrations
npx prisma studio         # Open database GUI
```

## Environment Variables Required

Create a `.env` file with:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Project Structure

```
/app                    # Next.js app directory
  /api                  # API routes
  /tutor                # Tutor pages
  /learner              # Learner pages (coming in Phase 4)
/components             # React components
  /tutor                # Tutor-specific components
/lib                    # Utility functions
/prisma                 # Database schema and migrations
/docs                   # Project documentation
```

## Current URLs

After starting the dev server (`npm run dev`):

- **Home**: http://localhost:3002
- **Tutor Signup**: http://localhost:3002/tutor/signup
- **Tutor Login**: http://localhost:3002/tutor/login
- **Tutor Dashboard**: http://localhost:3002/tutor/dashboard
- **Add Learner**: http://localhost:3002/tutor/learners/add
- **Design System**: http://localhost:3002/styleguide

## Testing Flow

1. Visit http://localhost:3002
2. Click "Tutor Portal"
3. Sign up with email/password
4. Log in
5. Add a learner with 4-digit PIN
6. View learner on dashboard

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth v5
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS + CSS Variables
- **Fonts**: Google Fonts (Slackey, Poppins)

## Phase Status

- ✅ Phase 1: Foundation (Database, Auth Setup)
- ✅ Phase 2: Tutor Onboarding (Signup, Login, Dashboard, Add Learner)
- ⏳ Phase 3: Weekly Cycle Creation
- ⏳ Phase 4: Learner Experience
- ⏳ Phase 5: Weekly Review

## Troubleshooting

### Build fails with "Cannot find module 'pg'"
```bash
npm install --save-dev @types/pg
```

### Database connection error
- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Run `npx prisma migrate dev`

### "Missing suspense boundary" error
- Already fixed in TutorLoginForm.tsx
- Rebuild: `npm run build`

## Need Help?

- Check `/docs/IMPLEMENTATION_PLAN.md` for full roadmap
- Check `/docs/STYLEGUIDE.md` for design tokens
- Check `/docs/SCREEN_STRUCTURE.md` for UI specs
- Check `PHASE2_COMPLETE.md` for Phase 2 details
