# Board Master - Screen Structure (SIMPLIFIED MVP)

## Key MVP Simplifications

1. **No Profile Types**: All learners see same UI (no Sentinel/Explorer/Diplomat/Analyst themes)
2. **Task Count Display**: "8 of 10 tasks done" instead of "80%" everywhere
3. **Frequency Dots**: ● ● ○ instead of "2 of 3 times" text
4. **Copy Last Week**: Prominent button on task creation and post-review screens
5. **Tasks Locked**: No mid-week editing once cycle activated
6. **Fixed Points**: No point value inputs (always 10 per task)
7. **No Task Types**: Just "Regular Task" checkbox and "Boss Task" checkbox
8. **Expectation Field**: New optional field for "what does done look like?"

---

## Tutor Screens

### 1. Tutor Login
**Route**: `/tutor/login`

**Data Shown**:
- Email input field
- Password input field (masked)
- "Forgot Password?" link
- "Sign Up" link

**Child Safety**: N/A (adult-only screen)

---

### 2. Tutor Signup
**Route**: `/tutor/signup`

**Data Shown**:
- Full name input
- Email input
- Password input (with strength indicator)
- Confirm password input
- Terms of Service checkbox
- "Create Account" button

**Child Safety**: N/A (adult-only screen)

---

### 3. Tutor Dashboard
**Route**: `/tutor/dashboard`

**Data Shown**:
- Tutor name + logout button (top right)
- "Add Learner" button (if < 4 learners)
- Learner cards grid (1–4 cards):
  - Each card:
    - Learner display name
    - Simple icon (no profile type)
    - Current weekly status badge (Active / Review Ready / Completed / None)
    - **Task completion count** (e.g., "8 of 10 tasks done")
    - Points this week (e.g., "80 points")
    - "View Details" button
- Quick action buttons:
  - "Create Weekly Tasks"
  - "View All Learners"
  - "Settings"

**Child Safety**: Logout button requires confirmation

---

### 4. Learner Profile Management
**Route**: `/tutor/learners`

**Data Shown**:
- List of all learners with:
  - Display name
  - Simple icon
  - Total lifetime points
  - Date added
- Actions per learner:
  - "Edit Name"
  - "Reset PIN"
  - "View History"
  - "Archive Learner" (soft delete)

**Child Safety**: "Archive Learner" requires password confirmation

**REMOVED**: Profile type field, current level display

---

### 5. Weekly Task Creation
**Route**: `/tutor/weekly-tasks/[learner_id]`

**Data Shown**:
- Week date range (Mon DD – Sun DD)
- Learner name + simple icon
- **"Copy Last Week" button (PROMINENT)** if previous cycle exists
- "Start Fresh" button
- Task counter (X/12 tasks)
- Boss task counter (X/2)
- Task list:
  - Task icon, title, frequency, expectation snippet
  - Edit/Delete buttons per task (only if status != ACTIVE)
- "Add Task" button
- Total task completions needed (sum of frequencies)
- "Activate Week" button (if not yet active)
- **"Tasks Locked" banner** (if already active)

**Child Safety**: Confirmation required before deleting tasks with completions

**ADDED**: "Copy Last Week" button, "Expectation" field display, task locking
**REMOVED**: Point value display/edit, task type dropdown, mid-week editing

---

### 6. Add/Edit Task Modal
**Route**: Modal overlay on Task Creation screen

**Data Shown**:
- Task title input (max 50 chars, counter shown)
- Icon picker (grid of 30+ icons)
- Frequency per Week input (1–14)
- **Expectation input (NEW)**: "What does done look like?" (optional, max 200 chars)
- "This is a Boss Task" checkbox
- Point value: **Auto-displayed, not editable** (10 for regular, 0 for boss)
- "Save Task" button
- "Cancel" button

**Child Safety**: N/A (tutor-only)

**ADDED**: Expectation field
**REMOVED**: Task type dropdown, point value input

---

### 7. Weekly Review Screen
**Route**: `/tutor/review/[weekly_cycle_id]`

**Data Shown**:
- Learner name + simple icon
- Week date range
- Summary stats:
  - **Task completion count** ("8 of 10 tasks completed")
  - Points earned
  - Boss tasks completed
- List of all completed tasks:
  - Icon, title
  - Completion timestamp
  - **Expectation** (if set)
  - Approval status (Pending / Approved / Rejected)
  - Approve/Reject buttons
  - "Add Note" link
- Final totals section (updates live)
- "Finish Review" button

**Child Safety**: N/A (tutor-only)

**ADDED**: Expectation display, task count emphasis
**REMOVED**: Percentage-based displays

---

### 8. Post-Review Actions
**Route**: Modal after clicking "Finish Review"

**Data Shown**:
- Success message: "[Learner] completed X of Y tasks this week and earned Z points!"
- **"Copy Last Week" button (PROMINENT)**
- "Create Next Week from Scratch" button
- "Done for Now" button

**Child Safety**: N/A (tutor-only)

**ADDED**: Prominent "Copy Last Week" option immediately after review

---

### 9. Tutor Settings
**Route**: `/tutor/settings`

**Data Shown**:
- Account settings:
  - Full name (editable)
  - Email (display only)
  - "Change Password" button
- Preferences:
  - Timezone selector
  - Email notifications toggle (weekly review only)
- Danger zone:
  - "Delete Account" (requires password + confirmation)

**Child Safety**: Delete account requires multiple confirmations

**REMOVED**: Notification preferences for task completions (no push notifications in MVP)

---

## Learner Screens

### 1. Learner Selection
**Route**: `/learner/select`

**Data Shown**:
- App logo + Tony Stark wizard avatar
- Grid of learner profile cards (large, colorful):
  - Simple icon (120px, scaled up)
  - Display name (large font, 28px)
- "Ask Tutor for Help" button (bottom)

**Child Safety**:
- No "add new learner" option visible
- Cards must be 120px × 120px minimum for accurate tapping
- No personal data visible

**REMOVED**: Profile type name display (no "The Explorer" subtitle)

---

### 2. Learner PIN Entry
**Route**: `/learner/pin`

**Data Shown**:
- Learner simple icon (large, centered)
- "Enter Your PIN, [learner name]" (large, friendly text, 24px)
- 4-digit number pad (80px × 80px buttons)
- PIN dots display (● ● ● ●, filled as typed)
- Error message if wrong PIN: "Oops! Wrong PIN. Try again or ask your tutor."
- "Back" button (returns to learner selection)

**Child Safety**:
- No "forgot PIN" option
- Wrong PIN doesn't reveal hints
- 5 failed attempts = 30-min lockout with message "Too many tries. Ask your tutor for help."
- Number pad only (no keyboard)

---

### 3. Learner Dashboard (Main Screen)
**Route**: `/learner/dashboard`

**Data Shown**:
- Header:
  - Wizard avatar (top left, animated)
  - Learner name (large, 24px)
  - Logout button (icon only, top right, tap-and-hold)
- Progress section:
  - **"8 of 10 tasks done!"** (large text, 28px, bold)
  - Visual progress bar (color-coded: red < 40%, yellow < 70%, green < 80%, gold ≥ 80%)
  - Wizard encouragement message (changes based on progress)
- Task section:
  - Title: "Your Tasks This Week"
  - Vertical list of task cards (incomplete first)
  - Each task card:
    - Icon (left, 60px)
    - Title (bold, 24px)
    - **Frequency dots** (● ● ○ = "2 of 3 done")
    - Completion status (checkmark or empty circle)
- Boss Task section (separate container, bottom):
  - Title: "Boss Tasks" (with trophy icon)
  - Lock status: "Complete 2 more tasks to unlock!" (if locked)
  - Boss task cards (2 max):
    - Larger than regular tasks
    - Golden border
    - Trophy icon
    - "LOCKED" overlay if not unlocked

**Child Safety**:
- Logout requires tap-and-hold (3 seconds)
- No settings access
- No browser navigation
- No external links
- No timestamps that create pressure
- No comparison to other learners

**ADDED**: Frequency dots, concrete countdown messaging
**REMOVED**: Percentage displays, point badges on cards, profile type theming

---

### 4. Task Completion Modal
**Route**: Modal overlay on Learner Dashboard

**Data Shown**:
- Large task icon (120px, centered)
- Task title (large, 24px)
- Expectation text (if tutor set one): "Remember: [expectation]"
- Confirmation question: "Did you complete this task?"
- Two buttons (large, 60px height):
  - "Yes, I did it!" (green, primary)
  - "Not yet" (gray, secondary)

**Child Safety**:
- Simple binary choice
- Positive language
- Large touch targets

**ADDED**: Expectation display to remind learner of standards

---

### 5. Task Completion Success
**Route**: Animated overlay on Learner Dashboard

**Data Shown**:
- Checkmark animation (1 second)
- Confetti burst
- "✓ Task complete!" message (de-emphasize points)
- Auto-dismisses after 2 seconds

**Child Safety**:
- Encouraging but not overstimulating
- No variable rewards
- No "watch ad for bonus" prompts

**CHANGED**: Removed "+X points!" emphasis, just "Task complete!"

---

### 6. Boss Task Unlock Celebration
**Route**: Animated modal on Learner Dashboard (triggered at 80% task count)

**Data Shown**:
- Wizard character animation (excited pose)
- Message: "Amazing work! You unlocked the Boss Tasks!"
- Visual: Boss task cards "unlock" with animation
- "Awesome!" button to dismiss

**Child Safety**:
- Joyful but not manipulative
- No pressure to complete immediately
- No countdown timers

---

### 7. Locked Boss Task Info Modal
**Route**: Modal overlay when tapping locked boss task

**Data Shown**:
- Lock icon (large, 80px)
- Message: "Complete 2 more tasks to unlock Boss Tasks!"
- **Visual progress**: "8 of 10 done" with dots or bar
- Encouraging message: "You're almost there—keep going!"
- "Got it!" button to dismiss

**Child Safety**:
- Encouraging, not shaming
- Concrete, countable goal
- No negative language

**CHANGED**: Shows concrete task count ("2 more tasks") instead of percentage ("reach 80%")

---

### 8. Week Review Message
**Route**: `/learner/week-review` (shown when weekly_cycle.status = REVIEW)

**Data Shown**:
- Wizard avatar
- Message: "Your tutor is reviewing your week! Check back soon to see your final score."
- Illustration of completed tasks
- "Okay" button (returns to learner selection)

**Child Safety**:
- No anxiety language
- No ability to view pending approvals

---

### 9. Waiting for New Week
**Route**: `/learner/waiting` (shown when no ACTIVE cycle)

**Data Shown**:
- Wizard avatar (relaxed pose)
- Message: "Your tutor is setting up your new week. Check back soon!"
- "Check Again" button (refreshes status)
- "Logout" button

**Child Safety**:
- No pressure or urgency
- No countdown
- No way to nag tutor

---

## Child Safety Considerations Summary

### Visual Design
- Large touch targets (minimum 60px × 60px, 80px for critical actions)
- High contrast colors (WCAG AAA compliant)
- Simple, sans-serif fonts (minimum 18px body, 24px headings)
- Icons supplement all text
- No flashing or rapidly moving elements

### Language
- Reading level: 1st–2nd grade (Flesch-Kincaid 2.0–3.0)
- Positive reinforcement only
- Active voice, short sentences
- **Concrete numbers** ("8 of 10 tasks") not abstract percentages ("80%")

### Interaction Controls
- No right-click menus
- Logout requires tap-and-hold (3 seconds)
- Confirmations prevent accidents
- No external navigation

### Data Privacy
- No personal data visible on learner screens
- No access to settings
- Icons only (no photos)

### Anti-Addiction Features
- No infinite scroll
- No variable rewards
- No daily login bonuses
- No push notifications to learners
- No "limited time" tactics
- Weekly reset provides natural break
- Task completion limits prevent grinding
- **De-emphasized points** (not shown prominently in celebrations)

### Content Restrictions
- No embedded videos
- No user-generated content
- No chat
- No external links
- No ads

### Accessibility
- Keyboard navigation
- Screen reader support (ARIA labels)
- Color-blind friendly
- Scalable text
- High contrast mode

---

## MVP Screen Count

**Tutor**: 9 screens
**Learner**: 9 screens
**Total**: 18 screens

**Reduction from original spec**: Removed profile selection screens, simplified task creation by removing type selection complexity.
