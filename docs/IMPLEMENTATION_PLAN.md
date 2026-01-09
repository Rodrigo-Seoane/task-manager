# Board Master - Implementation Plan (SIMPLIFIED MVP)

## MVP Stop Point

**Definition of Done**: MVP is complete when simplified 8 core features function end-to-end with one Tutor and one Learner, deployed to production.

**Estimated Timeline**: 18–20 days full-time (6–8 weeks part-time) - **Reduced from 24 days due to simplifications**

**Acceptance Criteria**:
- ✅ Tutor can create account, add learner, create weekly cycle
- ✅ Learner can log in with PIN, complete tasks, see progress
- ✅ Point calculation and boss task unlock work correctly
- ✅ Tutor can review and approve/reject tasks
- ✅ Weekly cycle transitions automatically (active → review → completed)
- ✅ Basic error handling and validation in place
- ✅ Deployed to production URL with HTTPS
- ✅ Mobile-responsive on iOS/Android browsers

**Explicitly NOT in MVP**:
- Multi-level progression (only Level 1, hidden from UI)
- Profile types (Sentinel/Explorer/Diplomat/Analyst)
- Task type complexity (Habit/Activity distinction)
- Custom point values (fixed at 10 per task)
- Mid-week task editing (locked after activation)
- Push notifications (email only for weekly review)
- Email notifications
- Task templates (only "Copy Last Week")
- Historical analytics
- Advanced animations or sounds
- Password reset flow
- Multiple tutor accounts per learner

---

## Implementation Phases

### Phase 1: Foundation (Days 1–3)

#### 1.1 Project Setup
```bash
# Initialize Next.js project
npx create-next-app@latest board-master --typescript --tailwind --app

# Install core dependencies
pnpm add prisma @prisma/client next-auth@beta bcryptjs zod react-hook-form @hookform/resolvers
pnpm add -D @types/bcryptjs

# Install UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog progress badge avatar
```

**Deliverables**:
- Project structure created
- Tailwind configured with child-safe design tokens (large text, high contrast)
- ESLint + Prettier configured
- Git repo initialized

#### 1.2 Database Schema
```bash
# Initialize Prisma
pnpm prisma init
```

**Tasks**:
- Create `prisma/schema.prisma` with all 7 models (Tutor, Learner, WeeklyCycle, Task, TaskCompletion)
- Define relationships and indexes
- Create initial migration

```bash
pnpm prisma migrate dev --name init
```

**Deliverables**:
- Database schema matches DATA_MODELS.md
- Seed script with sample data
- Prisma Client generated

#### 1.3 Authentication Setup

**Tasks**:
- Configure NextAuth.js with Credentials provider
- Create tutor signup/login API routes
- Create learner PIN login API route
- Implement middleware for protected routes

**Files**:
- `src/lib/auth.ts` (NextAuth config)
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/tutor/signup/route.ts`
- `src/middleware.ts` (route protection)

**Deliverables**:
- Tutor can create account and log in
- Sessions persist with JWT
- Protected routes redirect to login

**Test**: Create tutor via API, log in, verify JWT in cookie

---

### Phase 2: Tutor Onboarding (Days 4–6)

#### 2.1 Tutor UI - Authentication

**Screens**:
- Tutor Login (`/tutor/login`)
- Tutor Signup (`/tutor/signup`)

**Components**:
- `TutorLoginForm.tsx`
- `TutorSignupForm.tsx`

**Deliverables**:
- Forms with React Hook Form + Zod validation
- Error handling for duplicate email, weak password
- Success redirect to dashboard

**Test**: Create account, log out, log back in

#### 2.2 Tutor Dashboard

**Screen**: `/tutor/dashboard`

**Components**:
- `TutorDashboard.tsx`
- `LearnerCard.tsx` (empty state initially)
- `Navigation.tsx`

**Deliverables**:
- Shows tutor name
- "Add Learner" button (functional)
- Empty state message if no learners
- Logout button

**Mock Data**: Use seed script to create sample learner for visual testing

**Test**: Dashboard loads, shows correct tutor name, logout works

#### 2.3 Add Learner Flow

**Screens**:
- Add Learner Modal (or `/tutor/learners/create`)

**Components**:
- `ProfileSelector.tsx` (4 profile type cards)
- `PinSetup.tsx` (4-digit number pad)
- `WizardMessage.tsx` (reusable for Tony Stark messages)

**API Routes**:
- `POST /api/learners` (create learner)

**Deliverables**:
- Profile selection UI with descriptions
- PIN creation with validation (4 digits, no letters)
- Learner created in database with correct profile type
- Wizard messages appear at correct steps

**Test**: Create learner, verify in database, verify PIN works for login

---

### Phase 3: Weekly Cycle Creation (Days 7–9)

#### 3.1 Task Creation UI

**Screen**: `/tutor/weekly-tasks/[learnerId]`

**Components**:
- `WeeklyTaskList.tsx`
- `TaskForm.tsx` (modal or separate form)
- `IconPicker.tsx` (grid of SVG icons)

**API Routes**:
- `POST /api/weekly-cycles` (create cycle)
- `POST /api/tasks` (create task)
- `DELETE /api/tasks/[id]` (delete task)

**Deliverables**:
- Tutor can add tasks (title, type, icon, points, frequency)
- Task list shows all added tasks
- Validation: max 12 tasks, max 2 boss tasks
- Boss task toggle only shows for Reward type
- Total possible points calculated correctly

**Hardcoded for now**: Week always starts next Monday, 7 days

**Test**: Create 10 tasks, verify point calculation, try adding 13th (should error)

#### 3.2 Activate Weekly Cycle

**Deliverables**:
- "Activate Week" button creates weekly_cycle with status = ACTIVE
- Learner can now see tasks on their dashboard
- Only one ACTIVE cycle per learner enforced

**Test**: Activate cycle, verify status in DB, verify learner can see tasks

---

### Phase 4: Learner Experience (Days 10–13)

#### 4.1 Learner Login

**Screens**:
- Learner Selection (`/learner/select`)
- PIN Entry (`/learner/pin`)

**Components**:
- `LearnerSelectionCard.tsx` (large, colorful cards)
- `PinPad.tsx` (4-digit number pad, child-friendly)

**API Routes**:
- `POST /api/auth/learner/login`

**Deliverables**:
- Learner selection screen shows all learners for logged-in tutor
- PIN entry with large buttons (80px × 80px)
- Rate limiting: 5 attempts, 30-min lockout on wrong PIN
- Success redirects to Learner Dashboard

**Test**: Select learner, enter correct PIN, verify session created

#### 4.2 Learner Dashboard - Core

**Screen**: `/learner/dashboard`

**Components**:
- `LearnerDashboard.tsx`
- `TaskCard.tsx`
- `BossTaskCard.tsx`
- `ProgressBar.tsx`
- `WizardMessage.tsx` (reused from tutor flow)

**Deliverables**:
- Shows wizard avatar and greeting
- Progress bar with color-coded states (red/yellow/green/gold)
- Task cards in vertical list (incomplete first)
- Boss task section at bottom (locked initially)
- Each task shows: icon, title, points, completion status

**Mock Data**: Use active weekly cycle from Phase 3

**Test**: Dashboard renders, shows tasks, progress bar at 0%

#### 4.3 Task Completion

**Components**:
- `TaskCompletionModal.tsx` (confirmation dialog)
- `CompletionAnimation.tsx` (checkmark + confetti)

**API Routes**:
- `POST /api/tasks/complete`

**Business Logic**:
- Check frequency limit (can't complete more than task.frequency_per_week)
- Check boss task unlock (requires 80% completion)
- Calculate points, update weekly cycle totals
- Run boss unlock check after each completion

**Deliverables**:
- Tap task → confirmation modal appears
- "Yes, I did it!" → task marked complete, points awarded
- Progress bar updates in real-time
- Boss tasks unlock at 80% with wizard celebration message

**Test Cases**:
1. Complete 5 of 10 tasks (50%), verify progress bar yellow
2. Complete 8 of 10 tasks (80%), verify boss tasks unlock
3. Try completing task beyond frequency limit (should error)
4. Try completing locked boss task (should show lock message)

#### 4.4 Boss Task Completion

**Deliverables**:
- Boss task cards "unlock" visually at 80%
- Tap unlocked boss task → completion modal with trophy animation
- Boss task marked complete (no points added)
- Cannot complete more than 2 boss tasks (Level 1 limit)

**Test**: Unlock boss tasks, complete one, verify can still complete second, verify 3rd is blocked

---

### Phase 5: Weekly Review (Days 14–16)

#### 5.1 Weekly Cycle Transition

**Background Job** (or cron job via Vercel):
- Check all ACTIVE cycles where end_date is today
- Set status = REVIEW
- (Later: send email notification to tutor)

**For MVP**: Manual trigger or check on tutor dashboard load

**Deliverables**:
- Function `transitionWeeklyCycles()` in `src/lib/weekly-cycle.ts`
- Called on tutor dashboard page load (temporary for MVP)

**Test**: Set cycle end_date to yesterday, load dashboard, verify status changes to REVIEW

#### 5.2 Review UI

**Screen**: `/tutor/review/[cycleId]`

**Components**:
- `WeeklyReview.tsx`
- `TaskReviewRow.tsx` (each completed task with approve/reject buttons)

**API Routes**:
- `PATCH /api/weekly-cycles/[id]/review` (approve/reject tasks)
- `POST /api/weekly-cycles/[id]/complete` (finalize review)

**Deliverables**:
- List of all task completions for the week
- Each row: task icon, title, completion time, points, approve/reject buttons
- Default: all tasks auto-approved (tutor_approved = null)
- Reject button opens confirmation, removes points if confirmed
- Final totals update live as approvals change

**Test**: Review cycle, reject 2 tasks, verify points recalculated, verify completion % updates

#### 5.3 Complete Review

**Deliverables**:
- "Finish Review" button:
  - Sets weekly_cycle.status = COMPLETED
  - Sets tutor_reviewed_at = NOW()
  - Updates learner.total_points
- Prompt: "Create next week's tasks?"
- If not created within 2 days: auto-approve all tasks (fallback)

**Test**: Finish review, verify status = COMPLETED, verify learner.total_points updated

---

### Phase 6: Narrative System (Days 17–18)

#### 6.1 Wizard Character Assets

**Tasks**:
- Create or source wizard character illustrations (5 poses minimum):
  - Waving (welcome)
  - Excited (explaining tasks)
  - Celebration (boss unlock)
  - Encouraging (weekly reset)
  - Supportive (review complete)
- Save as SVG or PNG in `/public/wizard/`

**Deliverables**:
- Wizard images ready for import
- License confirmed (original or licensed for commercial use)

#### 6.2 Narrative Message Implementation

**File**: `src/constants/narrative.ts`

**Structure**:
```typescript
export const narrativeMessages = {
  tutorWelcome: {
    messages: ["Welcome...", "Let's create..."],
    buttonText: "Let's Go!",
    wizardPose: "waving"
  },
  // ... all messages from NARRATIVE_SYSTEM.md
}
```

**Component**: `WizardMessage.tsx`

**Props**:
- `messageKey`: string (key from narrativeMessages)
- `variables`: object (e.g., { learner_name: "Alex", points: 45 })
- `onDismiss`: function

**Deliverables**:
- All messages from NARRATIVE_SYSTEM.md implemented
- WizardMessage component renders messages with correct wizard pose
- Variable interpolation works (e.g., `{learner_name}`)

#### 6.3 Integrate Messages into Flows

**Trigger Points**:
- Tutor welcome: First dashboard load (check if `tutor.onboarding_completed = false`)
- Profile selection: When tutor selects profile type
- Learner first login: Check if `learner.onboarding_completed = false`
- Boss unlock: When completion_percentage hits 80% for first time
- Weekly reset: Monday morning login
- Review complete: After tutor finishes review

**Deliverables**:
- Messages appear at correct moments
- Can be dismissed (saves to localStorage or DB)
- Do not reappear unless triggered again

**Test**: Walk through full flow, verify all messages appear once at correct times

---

### Phase 7: Polish & Validation (Days 19–20)

#### 7.1 Input Validation

**Tasks**:
- Add Zod schemas for all API routes
- Validate on client and server
- Return clear error messages

**Key Validations**:
- Email format (tutor signup)
- Password strength (min 8 chars, tutor signup)
- PIN format (exactly 4 digits, learner creation)
- Task frequency (1–14, task creation)
- Max tasks per cycle (12 for Level 1)
- Boss task limits (2 for Level 1)

**Deliverables**:
- All API routes reject invalid input with 400 status
- Client forms show inline errors

**Test**: Try creating invalid data, verify errors show correctly

#### 7.2 Error Handling

**Tasks**:
- Add try-catch blocks to all API routes
- Return standardized error responses
- Show user-friendly error messages in UI

**Error Types**:
- Authentication errors (401)
- Authorization errors (403)
- Validation errors (400)
- Not found errors (404)
- Server errors (500)

**Deliverables**:
- No unhandled promise rejections
- All errors logged to console (later: Sentry)
- User sees friendly error message (not raw error stack)

**Test**: Trigger errors (wrong PIN, exceed task limit, etc.), verify messages

#### 7.3 Mobile Responsiveness

**Tasks**:
- Test all screens on mobile viewport (375px width)
- Ensure touch targets are 48px × 48px minimum
- Fix overflow/scrolling issues

**Key Screens**:
- Learner Selection (cards stack vertically)
- PIN Pad (buttons large enough for child fingers)
- Task Cards (full width, large tap area)
- Tutor forms (inputs full width, readable on small screens)

**Deliverables**:
- All screens usable on iPhone SE (375px) and up
- No horizontal scroll
- Text readable without zooming

**Test**: Chrome DevTools mobile view, real device testing on iOS/Android

---

### Phase 8: Deployment (Days 21–22)

#### 8.1 Environment Setup

**Tasks**:
- Create Supabase project, get database URL
- Create Vercel project, link to GitHub repo
- Add environment variables to Vercel

**Variables**:
```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
```

**Deliverables**:
- Database hosted on Supabase
- Production environment variables configured

#### 8.2 Initial Deployment

**Tasks**:
- Push to main branch
- Run Prisma migrations on production database
- Deploy to Vercel

```bash
# On local
pnpm prisma migrate deploy --preview-feature

# Or via Vercel build settings
# Build Command: prisma migrate deploy && next build
```

**Deliverables**:
- App live at `https://board-master.vercel.app`
- Database migrations applied
- HTTPS working

**Test**: Access production URL, create account, verify database writes

#### 8.3 Custom Domain (Optional for MVP)

**Tasks**:
- Purchase domain (e.g., `boardmaster.app`)
- Add domain to Vercel
- Update NEXTAUTH_URL

**Deliverables**:
- App accessible at custom domain
- HTTPS certificate auto-provisioned

---

### Phase 9: End-to-End Testing (Day 23)

#### 9.1 Full User Journey Tests

**Test Case 1: Tutor Onboarding**
1. Sign up as tutor
2. Add learner (Explorer profile, PIN: 1234)
3. Create weekly cycle with 10 tasks (8 regular, 2 boss)
4. Activate week
5. Verify learner can see tasks

**Test Case 2: Learner Completes Tasks**
1. Log in as learner (PIN: 1234)
2. Complete 8 tasks
3. Verify progress bar reaches 80%
4. Verify boss tasks unlock with wizard message
5. Complete 1 boss task
6. Logout

**Test Case 3: Tutor Reviews Week**
1. Log in as tutor
2. Manually trigger week end (set end_date to yesterday in DB for testing)
3. Go to review screen
4. Reject 1 task
5. Finish review
6. Verify final points correct
7. Create next week's tasks

**Expected Results**: All flows complete without errors

#### 9.2 Edge Case Testing

**Test Cases**:
- Try logging in with wrong PIN (5 times) → verify lockout
- Try creating 13 tasks → verify error
- Try completing task beyond frequency → verify error
- Try completing locked boss task → verify lock message
- Try activating week when one already ACTIVE → verify error

**Expected Results**: All validations work, clear error messages shown

#### 9.3 Browser Compatibility

**Test Browsers**:
- Chrome (desktop + mobile)
- Safari (desktop + iOS)
- Firefox (desktop)
- Edge (desktop)

**Deliverables**:
- App works on all browsers
- No console errors
- Polyfills added if needed

---

### Phase 10: Documentation & Handoff (Day 24)

#### 10.1 Developer Documentation

**Files to Create**:
- `README.md` (setup instructions, key commands)
- `docs/API.md` (API route documentation)
- `docs/DEPLOYMENT.md` (deployment process)

**Deliverables**:
- New developer can set up project in < 30 minutes
- All environment variables documented
- Common issues and solutions listed

#### 10.2 User Documentation

**Files to Create** (later can be built into app):
- `docs/TUTOR_GUIDE.md` (how to use as a tutor)
- `docs/LEARNER_GUIDE.md` (how to use as a learner, child-friendly)

**Deliverables**:
- Step-by-step guides with screenshots
- FAQ section
- Troubleshooting (forgot PIN, tasks not showing, etc.)

---

## Implementation Order Summary

| Phase | Days | Focus | Deliverable |
|-------|------|-------|-------------|
| 1 | 1–3 | Foundation | Project setup, DB schema, auth |
| 2 | 4–6 | Tutor onboarding | Login, dashboard, add learner |
| 3 | 7–9 | Task creation | Weekly cycle UI, task form |
| 4 | 10–13 | Learner experience | Login, dashboard, task completion |
| 5 | 14–16 | Review flow | Weekly review, cycle transitions |
| 6 | 17–18 | Narrative | Wizard messages integrated |
| 7 | 19–20 | Polish | Validation, errors, mobile |
| 8 | 21–22 | Deployment | Production deploy, domain |
| 9 | 23 | Testing | E2E tests, edge cases |
| 10 | 24 | Documentation | README, guides |

**Total: 24 days (4.8 weeks for solo developer working full-time)**

**Realistic estimate for part-time work: 8–10 weeks**

---

## What to Mock/Hardcode Initially

### Phase 1–3 (Until learner experience built)
- **Hardcode**: Sample learner data in seed script
- **Mock**: Task icons (use emojis instead of custom SVG)
- **Skip**: Email notifications

### Phase 4–6 (Until review flow built)
- **Hardcode**: Weekly cycle always starts "next Monday"
- **Mock**: Boss unlock animation (simple CSS, not complex Lottie)
- **Skip**: Auto-review fallback (2-day timeout)

### Phase 7–8 (Until production ready)
- **Mock**: Wizard character images (use placeholder or simple SVG)
- **Skip**: Sound effects for task completion
- **Skip**: Advanced error logging (use console.log)

### Post-MVP (Not blocking launch)
- Email notifications
- Password reset flow
- Task templates
- Historical analytics
- Multiple tutor accounts per family
- Level 2+ progression

---

## Stop Point Checklist

Before declaring MVP "done":

- [ ] Tutor can sign up, log in, add learner
- [ ] Tutor can create weekly cycle with 12 tasks max
- [ ] Learner can log in with PIN
- [ ] Learner can complete tasks, see progress
- [ ] Boss tasks unlock at 80% completion
- [ ] Learner can complete boss tasks
- [ ] Tutor can review and approve/reject tasks
- [ ] Weekly cycle transitions (active → review → completed)
- [ ] Points calculate correctly
- [ ] All wizard messages appear at correct times
- [ ] Mobile-responsive on iOS/Android
- [ ] Deployed to production with HTTPS
- [ ] No critical bugs (auth works, data persists, validations enforce)

**If all checked: MVP is DONE. Ship it.**

---

## Post-MVP Prioritization (After Launch)

### Immediate (Week 1–2 post-launch)
1. **Monitor for bugs**: Set up Sentry, check logs daily
2. **User feedback**: Add simple feedback form
3. **Performance**: Check load times, optimize slow queries

### Short-term (Month 1–2)
1. **Email notifications**: Tutor gets weekly review reminders
2. **Password reset**: Forgot password flow for tutors
3. **Task templates**: Pre-built task lists (morning routine, homework, chores)

### Medium-term (Month 3–6)
1. **Level 2–5**: Implement full progression system
2. **Historical analytics**: Charts showing weekly progress over time
3. **Custom wizard**: Let learners choose wizard appearance
4. **Sound effects**: Optional audio for task completion

### Long-term (Month 6+)
1. **Mobile apps**: Native iOS/Android (React Native or Flutter)
2. **Multi-family accounts**: Share task templates, invite co-tutors
3. **AI-generated tasks**: Suggest age-appropriate tasks based on learner profile
4. **Accessibility**: Screen reader optimization, voice control

**Key Principle**: Don't build these until MVP is proven with real users. Validate demand first.

---

## Time Savings from Simplifications

| Removed Feature | Time Saved | Rationale |
|----------------|------------|-----------|
| Profile types (UI themes) | 3–4 days | Complex theme switching, testing across 4 variants |
| Task type dropdown | 0.5 days | Simpler form, fewer validations |
| Custom point values | 0.5 days | No input validation, simpler math |
| Mid-week task editing | 1 day | Avoids recalculation bugs, state management complexity |
| Level UI display | 0.5 days | No badges, progress bars, or level-up animations |
| **Total Saved** | **5–6 days** | **Reduced from 24 to 18–20 days** |

## Simplified Implementation Order

| Phase | Days | Original | Simplified | Savings |
|-------|------|----------|------------|---------|
| 1. Foundation | 3 | DB with profile_type, task_type enums | DB without enums, simpler schema | Same |
| 2. Tutor onboarding | 2 | Profile selection UI | Direct to PIN setup | -1 day |
| 3. Task creation | 2 | Type dropdown, point input | Checkbox + auto-points | -1 day |
| 4. Learner experience | 3 | % displays, profile themes | Count displays, single theme | -1 day |
| 5. Review flow | 3 | Same | Same | Same |
| 6. Narrative | 1 | Profile-specific messages | Unified messages | -1 day |
| 7. Polish | 2 | Same | Same | Same |
| 8. Deployment | 2 | Same | Same | Same |
| 9. Testing | 1 | 4 profile variants | 1 variant | -1 day |
| **Total** | **19** | **24 days** | **18–20 days** | **4–6 days** |

**Part-time estimate**: 6–8 weeks (vs. 8–10 weeks original)
