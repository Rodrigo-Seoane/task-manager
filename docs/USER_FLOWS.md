# Board Master - User Flows

## A. Tutor Onboarding

### Steps
1. **Landing Page**
   - Show: App name, tagline, "Get Started" button
   - Decision: Click "Get Started"

2. **Account Creation Screen**
   - Show: Email, password, full name fields
   - Validation: Email format, password 8+ chars
   - Decision: Submit → creates Tutor account
   - Redirect: Tutor Dashboard

3. **Welcome Screen (First Login)**
   - Show: Tony Stark wizard welcome message
   - Content: "Welcome to Board Master! I'm Tony, your Game Wizard. Let's create your first Learner profile."
   - Decision: Click "Add Learner"

4. **Add First Learner Screen**
   - Show: Display name field, PIN setup in same screen
   - Validation: Name 2-20 chars, no special characters
   - Decision: Enter name → PIN Setup section appears

5. **PIN Setup (Same Screen)**
   - Show: "Create a 4-digit PIN for [learner name]"
   - Input: 4-digit number pad
   - Validation: Exactly 4 digits
   - Decision: Confirm PIN → Learner created

6. **First Weekly Cycle Prompt**
   - Show: "Great! Now let's create [learner]'s first week of tasks."
   - Decision: Click "Create Weekly Tasks" → Task Creation Flow

### Key Validations
- Email uniqueness check on account creation
- Password strength requirements
- Learner display name must be unique per tutor
- PIN must be 4 digits (no letters/symbols)

### REMOVED FROM MVP
- **Profile Selection (Sentinel/Explorer/Diplomat/Analyst)**: Adds 3–4 days development time without functional value. Single UI for all learners in MVP. Can add as themes post-MVP.

---

## B. Learner Onboarding (with Tutor Present)

### Steps
1. **Learner Login Screen**
   - Show: List of learner names (large text) with simple icons
   - Design: Large cards (120px × 120px minimum), high contrast
   - Decision: Select learner card → PIN Entry

2. **PIN Entry Screen**
   - Show: 4-digit number pad (80px × 80px buttons), learner name at top
   - Validation: PIN matches learner.pin_code
   - Error: "Wrong PIN. Ask your tutor for help."
   - Decision: Correct PIN → First-Time Tutorial (if first login)

3. **First-Time Tutorial (Wizard Introduction)**
   - Screen 1: Tony Stark appears
     - Message: "Hi [learner name]! I'm Tony the Game Wizard. I'll help you complete tasks and earn rewards!"
     - Decision: Tap "Next"

   - Screen 2: How Tasks Work
     - Message: "See these cards? Each one is a task. Tap a task to mark it complete!"
     - Visual: Sample task card with tap animation
     - Decision: Tap "Next"

   - Screen 3: Boss Tasks
     - Message: "Complete 8 of your 10 tasks to unlock special Boss Tasks—big rewards!"
     - Visual: Locked boss task card with visual progress (e.g., "8 of 10" with dots)
     - Decision: Tap "Got It!" → Learner Dashboard

4. **Learner Dashboard (First View)**
   - Show: Current weekly tasks, progress bar, wizard avatar
   - Highlight: First incomplete task with gentle pulse animation
   - Decision: Explore and complete tasks

### Key Validations
- Tutorial only shows once per learner
- Tutorial can be skipped (small "Skip" text)
- Tutor must be present to enter PIN first time
- No account recovery flow (tutor resets PIN if forgotten)

---

## C. Creating the First Weekly Task List

### Steps
1. **Task Creation Entry**
   - Triggered: After learner creation OR from Tutor Dashboard
   - Screen: "Weekly Tasks for [Learner Name]"
   - Show: Week date range (Mon–Sun), "Add Task" button, task count (0/12)
   - **NEW**: If previous week exists, show "Copy Last Week" button prominently

2. **Add Task Screen** (simplified)
   - Show: Task creation form
   - Fields:
     - Task Title (required, max 50 chars)
     - Icon selector (optional, grid of 30+ icons)
     - Frequency per Week (1–14, default: 1)
     - Expectation (optional, "What does done look like?", max 200 chars)
     - "This is a Boss Task" checkbox (bottom of form)
   - Point Value: Auto-set (10 for regular, 0 for boss) - NOT editable
   - Decision: Click "Save Task"

3. **Task Added Confirmation**
   - Show: Task appears in list with icon, title, frequency
   - Update: Task count (e.g., 1/12)
   - Decision:
     - Add more tasks → repeat step 2
     - Finish → "Activate Week"

4. **Review Before Activation**
   - Show: Summary of all tasks
   - Display:
     - Total tasks (X/12)
     - Boss tasks (X/2)
     - Total task completions needed (sum of all frequencies)
     - Week date range
   - Validation checks:
     - Warn if < 5 tasks ("Add more tasks for better engagement")
     - Error if > 12 tasks ("Maximum 12 tasks per week")
     - Error if > 2 boss tasks ("Maximum 2 Boss Tasks per week")
   - Decision: Click "Activate Week"

5. **Week Activated**
   - Status: weekly_cycle.status = ACTIVE
   - Tasks are now LOCKED (no edits until week ends)
   - Show: Success message "Week is live! [Learner] can start completing tasks."
   - Redirect: Tutor Dashboard
   - Notification: Learner sees new tasks on next login

### Key Validations
- Cannot activate cycle with 0 tasks
- Cannot exceed 12 total tasks
- Cannot exceed 2 boss tasks
- Boss tasks automatically have 0 points
- Regular tasks automatically have 10 points (not editable)
- Start date must be upcoming or current Monday
- Cannot create cycle if one already ACTIVE for this learner

### SIMPLIFIED IN MVP
- **No Task Types** (Habit/Activity/Reward): Just regular tasks and boss tasks
- **Fixed Point Values**: Always 10 for regular, 0 for boss (not editable by tutor)
- **Tasks Locked After Activation**: Cannot edit mid-week (prevents bugs and confusion)

### NEW FEATURE: Copy Last Week

**Purpose**: Reduce tutor task creation time from 15 minutes to 2 minutes

**Flow**:
1. **Tutor clicks "Create Weekly Tasks"** for next week
2. **"Copy Last Week" button shown** if previous completed cycle exists
3. **Tutor clicks "Copy Last Week"**
   - System duplicates all tasks from previous week
   - Task titles, icons, frequencies, expectations, and boss task flags copied
   - New weekly_cycle created with status = DRAFT
4. **Review Copied Tasks**
   - Tutor can edit individual tasks (title, frequency, icon)
   - Tutor can add new tasks (if under 12)
   - Tutor can delete tasks
   - Changes only affect new week, previous week unchanged
5. **Activate Week** when ready

**Alternative**: Tutor can click "Start Fresh" to create tasks from scratch

**Benefits**:
- Saves 13 minutes per week per learner
- Reduces decision fatigue
- Encourages consistency in routines
- Still allows customization

---

## D. Learner Completing Tasks

### Steps
1. **Learner Dashboard View**
   - Show:
     - Wizard avatar with greeting based on time of day
     - Progress display: "8 of 10 tasks done!" (large, clear text)
     - Visual progress bar (color-coded: red/yellow/green/gold)
     - Task cards in vertical list
     - Boss task cards (locked or unlocked section at bottom)
   - Each task card shows:
     - Icon (60px, left side)
     - Title (large, 24px font)
     - Completion dots for frequency (e.g., ● ● ○ = "2 of 3 done")
     - Checkmark or empty circle for status

2. **Task Card Interaction**
   - Decision: Tap incomplete task card → Confirmation Modal

3. **Task Completion Confirmation**
   - Show: Large task icon, title, "Did you complete this task?"
   - Buttons: "Yes, I did it!" / "Not yet"
   - Decision:
     - "Yes" → Mark complete
     - "Not yet" → Close modal

4. **Completion Animation**
   - Visual: Checkmark animation, confetti burst
   - Show: "✓ Task complete!" message (de-emphasize points)
   - Sound: Success sound (optional, toggled in settings)
   - Update:
     - Task card shows checkmark
     - Progress text updates: "8 of 10 tasks done!"
     - Progress bar fills

5. **Boss Task Unlock Check**
   - If task count hits 80% threshold for first time this week:
     - Trigger: Wizard celebration animation
     - Message: "Amazing! You unlocked the Boss Tasks! Tap them to claim your reward."
     - Visual: Boss task cards "unlock" with animation
     - Decision: Continue exploring tasks

6. **Boss Task Completion**
   - Tap unlocked boss task → Confirmation Modal
   - Show: "You earned this reward! Show this to your tutor."
   - Visual: Trophy animation
   - Decision: "Claim Reward!" → Marks boss task complete
   - Note: No points added, but status changes

7. **Attempting Locked Boss Task**
   - Tap locked boss task → Info Modal
   - Message: "Complete 2 more tasks to unlock Boss Tasks!"
   - Show: Current progress visually (e.g., "8 of 10 done")
   - Decision: "Okay" → Close modal

8. **Attempting Completed Task**
   - Tap already-completed task (if frequency allows more):
     - Show: Same completion flow as step 3–4
   - Tap fully-completed task (frequency limit reached):
     - Show: "You already did this task! Try another one."
     - Decision: "Okay" → Close modal

### Key Validations
- Task completion blocked if:
  - Frequency limit reached
  - Boss task not unlocked
  - Weekly cycle not ACTIVE
- Real-time progress updates after each completion (task count, not percentage)
- Boss unlock check runs after every task completion

### SIMPLIFIED IN MVP
- **Progress shown as task count**: "8 of 10 tasks done" instead of "80%"
- **Frequency shown as dots**: ● ● ○ instead of "2 of 3 times"
- **Points de-emphasized**: Not shown prominently in learner celebration
- **Locked task messaging**: Shows concrete countdown ("2 more tasks") not percentages

---

## E. Tutor Weekly Review and Scoring

### Steps
1. **Review Trigger**
   - When: Sunday 11:59 PM (end of weekly cycle)
   - Action: weekly_cycle.status = REVIEW
   - Notification: Tutor Dashboard shows "Review Ready" badge

2. **Tutor Dashboard View**
   - Show: List of learners with weekly status
   - Each learner card shows:
     - Name, simple icon
     - "Review Ready" badge if status = REVIEW
     - Task completion count ("8 of 10 tasks done")
     - Decision: Tap learner card → Review Screen

3. **Weekly Review Screen**
   - Show:
     - Week date range
     - Overall stats (X of Y tasks completed, Z points earned)
     - List of completed tasks
   - Each completed task shows:
     - Icon, title
     - Completion date/time
     - Expectation (if tutor set one)
     - Approval buttons: ✓ Approve / ✗ Reject
     - Status indicator (pending/approved/rejected)

4. **Task Approval Interaction**
   - Default: All tasks auto-approved (tutor_approved = null)
   - Decision: Tap "Reject" button
   - Show: Confirmation modal "Are you sure? This will remove points."
   - Options:
     - "Yes, reject" → tutor_approved = false, points removed
     - "Cancel" → No change
   - Note: Approve button is just visual confirmation (already approved by default)

5. **Add Notes (Optional)**
   - Each task row has "Add Note" link
   - Show: Text area (max 500 chars)
   - Purpose: Leave feedback for learner or personal notes
   - Save: Updates task_completion.tutor_notes

6. **Review Summary**
   - Show: Updated totals after approvals/rejections
   - Display:
     - Final task count ("8 of 10 tasks completed")
     - Final points earned
     - Boss task eligibility (did they complete 80% of tasks?)
     - Boss tasks completed
   - Decision: Click "Finish Review"

7. **Finish Review Confirmation**
   - Show: "Great job reviewing! [Learner] completed X of Y tasks this week and earned Z points."
   - Options:
     - **"Copy Last Week"** → Duplicates this week's tasks for next week (PROMINENT)
     - "Create Next Week" → Task Creation Flow (from scratch)
     - "Done for Now" → Tutor Dashboard
   - Action:
     - weekly_cycle.status = COMPLETED
     - weekly_cycle.tutor_reviewed_at = NOW()
     - learner.total_points += final earned points

8. **Auto-Review Fallback**
   - If tutor doesn't review by Tuesday 11:59 PM (2 days after cycle ends):
   - System auto-approves all pending tasks
   - Email sent: "Week auto-completed for [learner]. Points awarded."
   - Tutor can still view completed cycle but not change approvals

### Key Validations
- Cannot modify task completions after status = COMPLETED
- Task count and point recalculation happens instantly on approve/reject
- Boss task unlock status updates based on final task count (not point percentage)
- Cannot review if weekly_cycle.status != REVIEW

### SIMPLIFIED IN MVP
- **"Copy Last Week" prominently featured**: Reduces review→next week time from 15 min to 2 min
- **Task counts emphasized**: "8 of 10 tasks" shown throughout, not just percentages
- **Expectation field shown**: Helps tutors evaluate if task was "done well enough"
- **No push notifications**: Only email for weekly review ready (reduces interruptions)

---

## Flow Variations & Edge Cases

### Multi-Learner Management
- Tutor can add up to 4 learners (soft limit in MVP)
- Each learner has independent weekly cycles
- Review process happens separately for each learner
- Tutor Dashboard shows all learners side-by-side

### Mid-Week Task Adjustments
- Tutor can add/remove tasks during ACTIVE cycle
- Warning shown if removing task with completions
- Points recalculated immediately
- May affect boss task unlock status

### Learner Returns After Week Ends
- If cycle status = REVIEW or COMPLETED:
  - Show: "This week is being reviewed! Check back soon."
  - No tasks clickable
- If new cycle not created yet:
  - Show: "Your tutor is setting up your new week. Check back soon!"

### Forgotten PIN Recovery
- Learner flow: No "forgot PIN" option (security by design)
- Solution: Tutor logs in → Settings → Reset [learner] PIN
- Requires tutor password confirmation

### Partial Week Start
- If cycle created mid-week (e.g., Wednesday):
  - Week still runs Wed–Sunday (short week)
  - Next cycle auto-aligns to Monday–Sunday
  - Warning shown to tutor: "Starting mid-week. Next week will be full."
