# Board Master - Data Models

## Core Entities

### Tutor
**Purpose**: Adult account managing one or more Learners

**Fields**:
- `id` (UUID, primary key)
- `email` (string, unique, required)
- `password_hash` (string, required)
- `full_name` (string, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- Has many: Learners (one-to-many)

**Validation**:
- Email must be valid format
- Password minimum 8 characters
- Full name minimum 2 characters

---

### Learner
**Purpose**: Child account with simple profile and progress tracking

**Fields**:
- `id` (UUID, primary key)
- `tutor_id` (UUID, foreign key → Tutor)
- `display_name` (string, required, max 20 chars)
- `pin_code` (4-digit string, required)
- `total_points` (integer, default: 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- Belongs to: Tutor (many-to-one)
- Has many: WeeklyCycles
- Has many: TaskCompletions

**Validation**:
- Display name required, no special characters
- PIN must be exactly 4 digits

**REMOVED FROM MVP**:
- `profile_type` field (Sentinel/Explorer/Diplomat/Analyst) - Single UI for all learners
- `current_level` field - Level 1 rules enforced without storing level

---

### LearnerProfileType
**REMOVED FROM MVP**

Profile types (Sentinel/Explorer/Diplomat/Analyst) are NOT implemented in MVP.

**Rationale**:
- Adds complexity without functional value in MVP
- Requires theme switching logic and testing
- Increases development time by 3–4 days
- Can be added post-MVP as UI themes only

**Post-MVP Implementation**: When adding profile types later, implement as UI themes (colors, icons) without affecting core logic. Store as optional `profile_type` enum field on Learner model.

---

### Task
**Purpose**: Individual action within a weekly cycle

**Fields**:
- `id` (UUID, primary key)
- `weekly_cycle_id` (UUID, foreign key → WeeklyCycle)
- `title` (string, required, max 50 chars)
- `description` (string, optional, max 200 chars)
- `icon_name` (string, optional)
- `point_value` (integer, fixed at 10 for regular tasks, 0 for boss tasks)
- `frequency_per_week` (integer, default: 1)
- `is_boss_task` (boolean, default: false)
- `expectation` (string, optional, max 200 chars)
- `created_at` (timestamp)

**Relationships**:
- Belongs to: WeeklyCycle (many-to-one)
- Has many: TaskCompletions

**Validation**:
- Title required
- Point value: Always 10 for regular tasks, always 0 for boss tasks (not editable by tutor)
- Frequency: 1–14 (max 2x per day for a week)
- Boss tasks must have is_boss_task = true

**REMOVED FROM MVP**:
- `task_type` enum (HABIT/ACTIVITY/REWARD) - Simplified to just regular tasks and boss tasks
- Custom point values - Fixed at 10 per task to simplify progress calculation

**NEW FIELD**:
- `expectation`: Optional field for tutor to define "what does done look like?" (e.g., "Bed: covers pulled up, pillow straight")

---

### TaskType
**SIMPLIFIED IN MVP**

MVP has only TWO task categories:

1. **Regular Task** (is_boss_task = false)
   - Any routine, chore, or activity
   - Always worth 10 points
   - Can be completed 1–14 times per week (tutor sets frequency)
   - Examples: brush teeth, make bed, read book, help cook

2. **Boss Task** (is_boss_task = true)
   - Special reward/privilege
   - Always worth 0 points (doesn't count toward progress)
   - Unlocked when 80% of regular tasks completed (by count)
   - Max 2 per week (Level 1 rule)
   - Examples: extra screen time, choose dinner, special outing

**REMOVED FROM MVP**:
- HABIT vs ACTIVITY distinction - Not needed, adds decision fatigue for tutors
- Variable point values - Fixed at 10 per task simplifies math for children

**Implementation Note**: Use boolean `is_boss_task` field on Task model, not separate enum.

---

### WeeklyCycle
**Purpose**: Container for one week's worth of tasks (Monday–Sunday)

**Fields**:
- `id` (UUID, primary key)
- `learner_id` (UUID, foreign key → Learner)
- `start_date` (date, required, always Monday)
- `end_date` (date, required, always Sunday)
- `status` (enum: ACTIVE, REVIEW, COMPLETED, ARCHIVED)
- `total_possible_points` (integer, computed)
- `total_earned_points` (integer, default: 0)
- `completion_percentage` (decimal, computed)
- `boss_task_unlocked` (boolean, default: false)
- `tutor_reviewed_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- Belongs to: Learner (many-to-one)
- Has many: Tasks (one-to-many)

**Validation**:
- Only one ACTIVE cycle per learner at a time
- Start date must be Monday
- End date must be Sunday, 6 days after start
- Tasks locked once status = ACTIVE (no mid-week edits)

**Computed Fields (SIMPLIFIED IN MVP)**:
```
# Count-based calculation (not percentage-based)
total_regular_tasks = COUNT(tasks WHERE is_boss_task = false)

total_task_completions_needed = SUM(task.frequency_per_week)
  WHERE is_boss_task = false

total_tasks_completed = COUNT(task_completions
  WHERE weekly_cycle_id = X AND task.is_boss_task = false)

completion_count = "{total_tasks_completed} of {total_task_completions_needed} tasks"

# Boss unlock: 80% by COUNT, not points
boss_task_unlocked = (total_tasks_completed / total_task_completions_needed) >= 0.80

# Points still tracked but secondary
total_possible_points = total_task_completions_needed × 10
total_earned_points = total_tasks_completed × 10
```

**KEY CHANGE**: Progress shown as "8 of 10 tasks done" instead of "80%". Boss unlock based on task count, not point percentage.

---

### TaskCompletion
**Purpose**: Record of a single task being done

**Fields**:
- `id` (UUID, primary key)
- `task_id` (UUID, foreign key → Task)
- `learner_id` (UUID, foreign key → Learner)
- `weekly_cycle_id` (UUID, foreign key → WeeklyCycle)
- `completed_at` (timestamp, required)
- `completion_date` (date, extracted from completed_at)
- `tutor_approved` (boolean, nullable, default: null)
- `points_awarded` (integer, required)
- `tutor_notes` (string, optional, max 500 chars)

**Relationships**:
- Belongs to: Task, Learner, WeeklyCycle

**Validation**:
- Cannot complete same task more than frequency_per_week times
- Completion_date must fall within weekly_cycle start/end dates
- Points_awarded always 10 for regular tasks, 0 for boss tasks (fixed, not adjustable)
- Boss tasks can only complete if boss_task_unlocked = true

---

### Points
**Purpose**: Cumulative point tracking (derived from TaskCompletions)

**Implementation Note**: Not a separate table in MVP. Points are calculated from TaskCompletion records:

```
total_earned_points (weekly) = SUM(task_completion.points_awarded)
  WHERE weekly_cycle_id = X

total_points (lifetime) = SUM(task_completion.points_awarded)
  WHERE learner_id = Y
```

---

### Level
**HIDDEN FROM UI IN MVP**

**Level 1 Rules** (enforced silently):
- Max 12 total tasks per week (including boss tasks)
- Max 2 boss tasks per week
- Must complete 80% of tasks (by count) to unlock boss tasks

**Implementation Note**: Hardcoded constants in code. NOT stored in database. "Level 1" is NOT shown in learner UI (no "Apprentice" title, no level badge).

**Constants**:
```typescript
const LEVEL_1_RULES = {
  max_weekly_tasks: 12,
  max_boss_tasks: 2,
  unlock_threshold: 0.80 // 80% by task count
}
```

**Rationale for hiding**: Showing "Level 1" creates false expectation of Level 2+. Since MVP only has one level, enforce limits without displaying level concept to users.

**Post-MVP**: When adding Level 2–5, create Level database table and show progression UI.

---

### BossTask
**Purpose**: Special reward requiring consistent task completion

**Implementation Note**: Not a separate table. Boss tasks are Tasks with:
- `is_boss_task = true`
- `point_value = 0`

**Unlock Logic (COUNT-BASED)**:
```
total_tasks_completed = COUNT(task_completions WHERE is_boss_task = false)
total_tasks_needed = SUM(task.frequency_per_week WHERE is_boss_task = false)

boss_task_unlocked = (total_tasks_completed / total_tasks_needed) >= 0.80
AND
COUNT(tasks WHERE is_boss_task = true) <= 2
```

**Constraints**:
- Only accessible when 80%+ of regular tasks completed (by count, not points)
- Limited to 2 per week (Level 1 rule)
- Cannot be completed if unlock threshold not met
- Do not contribute to point totals
- Expire at end of weekly cycle (don't carry over)

**KEY CHANGE**: Unlock is task-count based (e.g., "8 of 10 tasks done"), not point-percentage based.

---

## Entity Relationship Summary

```
Tutor (1) ─────< (many) Learner
                    │
                    ├─────< (many) WeeklyCycle
                    │            │
                    │            └─────< (many) Task
                    │                      │
                    └─────< (many) TaskCompletion ───> (many) Task
```

## Data Constraints Summary (MVP)

1. **One active cycle per learner** - Enforce at application level
2. **Max 12 tasks per weekly cycle** (Level 1 rule, includes boss tasks)
3. **Max 2 boss tasks per cycle** (Level 1 rule)
4. **Fixed point values** - Always 10 for regular tasks, 0 for boss tasks (not editable)
5. **Task completion frequency limit** - Cannot exceed task.frequency_per_week
6. **Boss task gating** - Requires 80%+ of tasks completed (by count, not points)
7. **Weekly cycle dates** - Must align to Monday–Sunday
8. **Tasks locked after activation** - No mid-week edits once status = ACTIVE
9. **Count-based progress** - Display "X of Y tasks" instead of percentages

## Key Simplifications Applied

1. ✅ Removed `profile_type` from Learner (no Sentinel/Explorer/Diplomat/Analyst)
2. ✅ Removed `current_level` from Learner (Level 1 rules hardcoded)
3. ✅ Removed `task_type` enum (just `is_boss_task` boolean)
4. ✅ Fixed `point_value` (10 for regular, 0 for boss)
5. ✅ Added `expectation` field to Task (defines "what does done look like?")
6. ✅ Changed unlock logic to count-based instead of point-percentage
7. ✅ Added task locking after cycle activation (prevents mid-week edits)
