# Board Master - Product Specification

## 1. Core Problem

Children aged 6–9 struggle to build consistent habits and routines because traditional task management feels boring, abstract, and disconnected from their interests. Parents and tutors lack engaging tools to collaborate with children on habit formation, often resorting to nagging or rigid reward charts that don't adapt to each child's personality or progress. Board Master solves this by transforming daily routines into an age-appropriate game that celebrates progress, respects developmental stages, and creates a shared language between tutors and learners around responsibility and growth.

## 2. Primary Users

### Tutor (Parent/Guardian/Teacher)
**Profile**: Adult responsible for guiding a child's habits and routines. May manage 1–4 children simultaneously. Values structure, progress visibility, and teaching responsibility without constant conflict.

**Key Value Proposition**:
- Create and manage weekly task lists in minutes, not hours
- See real-time progress without asking "did you brush your teeth?"
- Teach responsibility through natural consequences (Boss Tasks)
- Adapt difficulty as children grow
- Celebrate wins together with clear milestones

### Learner (Child aged 6–9)
**Profile**: Early elementary student learning to manage daily routines. Can read simple sentences, understands basic numbers, responds to visual feedback and achievable goals.

**Key Value Proposition**:
- Turn boring chores into a game with a friendly wizard guide
- Know exactly what to do each day with pictures and simple words
- Feel powerful when completing tasks (points, levels, unlocks)
- Earn special "Boss Tasks" (bigger rewards) by being consistent
- See progress visually without complex numbers

## 3. Core MVP Features (Max 8)

1. **Dual-mode authentication**: Separate Tutor/Learner login experiences
2. **Simple learner profile**: Display name and PIN for secure child login
3. **Weekly task creation with "Copy Last Week"**: Tutor builds custom weekly cycles with Regular Tasks and Boss Tasks (rewards)
4. **Visual task completion**: Learner checks off tasks with clear visual feedback and celebration
5. **Task-count based progress**: Progress shown as "X of Y tasks done" instead of percentages
6. **Boss Task unlock system**: Complete 80% of weekly tasks (by count) to access special rewards
7. **Weekly review flow**: Tutor approves/rejects completed tasks with auto-approve fallback
8. **Tony Stark wizard narrative**: Character guides onboarding, progress milestones, and weekly resets

## 4. Explicit Non-Goals for MVP

- **Multi-level progression system** (only Level 1 in MVP, "Level" hidden from UI)
- **Learner profile types** (Sentinel/Explorer/Diplomat/Analyst themes - add post-MVP)
- **Task type complexity** (no Habit vs Activity distinction - just Regular Tasks + Boss Tasks)
- **Custom point values** (fixed at 10 points per task)
- **Mid-week task editing** (tasks locked once week is activated)
- **Push notifications** (no interruptions for task completions)
- **In-app purchases or payments**
- **Social features or multi-family sharing**
- **Complex analytics or historical reporting**
- **Mobile native apps** (web-only)
- **Task templates or marketplace** (only "Copy Last Week" in MVP)
- **Customizable avatar system**
- **Daily streak tracking**
- **Third-party integrations**

---

## Success Criteria for MVP

- Tutor can create a weekly task list in under 2 minutes (using "Copy Last Week")
- Learner can navigate and complete tasks independently after 1 tutorial
- 70%+ of Boss Tasks unlocked are actually completed
- Weekly review takes less than 5 minutes per child
- Children ask to use the app voluntarily after week 2
- Progress is clear without percentages (children understand "X of Y tasks")

## Key Simplifications Based on Critical Review

1. **Fixed point values**: All regular tasks worth 10 points (no customization)
2. **Task-count unlock**: Boss Tasks unlock at 80% by task count, not point percentage
3. **Visual progress**: Show "8 of 10 tasks done!" instead of "80%"
4. **No profile types in MVP**: Single consistent UI (add themed versions post-MVP)
5. **Copy Last Week**: One-click duplication of previous week's task list
6. **No mid-week edits**: Tasks locked once activated (prevents bugs and confusion)
7. **Level hidden**: Enforce Level 1 limits (12 tasks max, 2 boss tasks) without showing "Level 1" in UI
8. **No push notifications**: Email only for weekly review reminders
