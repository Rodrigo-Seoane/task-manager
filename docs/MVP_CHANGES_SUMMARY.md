# Board Master MVP - Changes Summary

## Overview

All product specification documents have been updated based on the Critical Review findings. These changes significantly simplify the MVP while maintaining core functionality, reducing development time from **24 days to 18–20 days** (20–25% faster).

---

## Key Simplifications Applied

### 1. ✅ Removed Profile Types (Sentinel/Explorer/Diplomat/Analyst)
**Savings**: 3–4 days development time

**Changes**:
- Removed `profile_type` field from Learner model
- All learners see same UI (no theme switching)
- Simpler onboarding flow (name + PIN only)
- Can add as UI themes post-MVP

**Impact**: Faster onboarding, easier testing, no theme management complexity

---

### 2. ✅ Task Count-Based Progress (Not Percentage)
**Savings**: Reduces child confusion, no additional dev time

**Changes**:
- Progress shown as "8 of 10 tasks done!" everywhere
- Boss unlock based on task count (80% = 8 of 10 tasks)
- Wizard messages use concrete numbers ("Complete 2 more tasks")
- Percentages removed from learner UI

**Impact**: Children understand progress intuitively, no abstract math

---

### 3. ✅ Fixed Point Values (10 per task)
**Savings**: 0.5 days development time

**Changes**:
- Regular tasks: Always 10 points (not editable)
- Boss tasks: Always 0 points
- Removed point value input from task creation form
- Simplified point calculation logic

**Impact**: Tutors save decision time, children see fair system, simpler math

---

### 4. ✅ Simplified Task Types (Regular + Boss Only)
**Savings**: 0.5 days development time

**Changes**:
- Removed `task_type` enum (Habit/Activity/Reward)
- Tasks are either Regular or Boss (boolean flag)
- Simpler task creation form (one checkbox)
- No type-based point ranges

**Impact**: Less decision fatigue for tutors, simpler data model

---

### 5. ✅ Tasks Locked After Activation
**Savings**: 1 day development time

**Changes**:
- Cannot edit tasks once `weekly_cycle.status = ACTIVE`
- Prevents mid-week recalculation bugs
- Clearer expectations for learners (tasks don't change)
- Tutor can "End Week Early" if urgent change needed

**Impact**: Fewer edge cases, no confusing task additions/removals mid-week

---

### 6. ✅ "Copy Last Week" Feature
**Savings**: Saves tutors 13 minutes per week

**Changes**:
- Prominent button on task creation and post-review screens
- One-click duplication of entire previous week
- Tutor can still edit copied tasks before activating
- Reduces task creation time from 15 min to 2 min

**Impact**: Major time savings for tutors, encourages consistent routines

---

### 7. ✅ Frequency Shown as Dots (Not Text)
**Savings**: Reduces child confusion, no additional dev time

**Changes**:
- Multi-completion tasks show ● ● ○ (2 of 3 done)
- Replaces "2 of 3 times" text
- More visual, less reading required

**Impact**: Easier for young children to understand at a glance

---

### 8. ✅ Level 1 Hidden from UI
**Savings**: 0.5 days development time

**Changes**:
- No "Level 1" or "Apprentice" badges shown
- Limits enforced silently (12 tasks max, 2 boss tasks max)
- Error messages don't mention "Level 1"
- Removes false expectation of Level 2 in MVP

**Impact**: Cleaner UI, no "when do I level up?" questions

---

### 9. ✅ No Push Notifications
**Savings**: Reduces tutor interruptions

**Changes**:
- Email notifications only for weekly review
- No real-time notifications for task completions
- No boss task completion alerts
- In-app badge shows "3 new completions" passively

**Impact**: Tutors check progress on their schedule, not app's schedule

---

### 10. ✅ Expectation Field Added
**Savings**: Reduces tutor-child conflict

**Changes**:
- New optional field: "What does done look like?"
- Shown during task creation and review
- Displayed to learner in completion modal
- Helps set clear standards (e.g., "Bed: covers pulled up, pillow straight")

**Impact**: Fewer arguments about "did I really do it?", clearer accountability

---

## Document Changes

### [PRODUCT_SPEC.md](PRODUCT_SPEC.md)
- Updated core features list (8 features)
- Added explicit non-goals section with all removed features
- Updated success criteria (2 min task creation, 5 min review)
- Added key simplifications section

### [DATA_MODELS.md](DATA_MODELS.md)
- Removed `profile_type` from Learner
- Removed `current_level` from Learner
- Removed `task_type` enum
- Fixed `point_value` to 10/0
- Added `expectation` field to Task
- Updated computed fields to use count-based logic
- Added constraints summary

### [GAMIFICATION_RULES.md](GAMIFICATION_RULES.md)
- Rewrote progress calculation to use task counts
- Updated boss unlock logic (count-based, not percentage)
- Fixed point values throughout
- Removed mid-week editing logic
- Updated visual feedback to show concrete countdowns
- Removed push notification triggers
- Added simplifications summary

### [USER_FLOWS.md](USER_FLOWS.md)
- Removed profile selection steps from tutor onboarding
- Added "Copy Last Week" flow (new feature)
- Updated all progress displays to task counts
- Changed frequency indicators to dots
- Updated boss unlock messaging (concrete numbers)
- Simplified task creation form
- Added task locking behavior

### [SCREEN_STRUCTURE.md](SCREEN_STRUCTURE.md)
- Completely rewrote with simplifications first
- Removed profile type displays throughout
- Added "Copy Last Week" buttons to 2 screens
- Updated all progress displays to task counts
- Added frequency dot displays
- Added expectation field displays
- Removed point value inputs
- Added task locking indicators
- Updated child safety considerations

### [NARRATIVE_SYSTEM.md](NARRATIVE_SYSTEM.md)
- Removed all profile type-specific messages
- Updated task completion language ("8 of your 10 tasks")
- Changed boss unlock messaging (concrete countdowns)
- De-emphasized points in celebrations
- Simplified onboarding messaging
- Added MVP simplifications summary

### [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- Updated timeline (18–20 days vs. 24 days)
- Added time savings breakdown table
- Updated non-goals list
- Added simplified implementation order comparison

### [CRITICAL_REVIEW.md](CRITICAL_REVIEW.md)
- Original document unchanged (serves as reference for all fixes)

---

## Development Time Savings

| Removed Feature | Time Saved | Cumulative |
|----------------|------------|------------|
| Profile types (UI themes) | 3–4 days | 3–4 days |
| Task type dropdown | 0.5 days | 3.5–4.5 days |
| Custom point values | 0.5 days | 4–5 days |
| Mid-week task editing | 1 day | 5–6 days |
| Level UI display | 0.5 days | 5.5–6.5 days |

**Total reduction**: 24 days → 18–20 days (**20–25% faster**)

---

## User Experience Improvements

### For Children (Learners)
1. **Easier to understand**: "8 of 10 tasks" vs "80%"
2. **Visual progress**: Dots (● ● ○) instead of text
3. **Concrete goals**: "Complete 2 more tasks" vs "reach 80%"
4. **Fair system**: All tasks worth same points (no gaming)
5. **Clear expectations**: Can see "what done looks like" for each task
6. **Consistent UI**: No theme switching confusion

### For Tutors
1. **Faster task creation**: 2 minutes with "Copy Last Week" vs 15 minutes from scratch
2. **Faster review**: Expectation field helps evaluate quality
3. **Fewer decisions**: No task types, no point values to choose
4. **Fewer interruptions**: No push notifications
5. **Clearer system**: Task counts easier to explain than percentages
6. **Less conflict**: Expectation field reduces "did you really do it?" arguments

---

## Remaining MVP Scope

**What's Still Included**:
- ✅ Dual-mode authentication (Tutor + Learner)
- ✅ Simple learner profiles (name + PIN)
- ✅ Weekly task creation with "Copy Last Week"
- ✅ Visual task completion with celebration
- ✅ Count-based progress ("8 of 10 tasks")
- ✅ Boss Task unlock at 80% (by count)
- ✅ Weekly review with approve/reject
- ✅ Tony Stark wizard narrative (key moments only)

**What's Definitely Out**:
- ❌ Profile types (Sentinel/Explorer/Diplomat/Analyst)
- ❌ Task types (Habit/Activity distinction)
- ❌ Custom point values
- ❌ Mid-week task editing
- ❌ Level progression (Level 2+)
- ❌ Level UI display
- ❌ Push notifications
- ❌ Complex analytics

---

## Next Steps

1. **Review updated documents** - Ensure all changes align with vision
2. **Clarify any conflicts** - Flag anything that seems inconsistent
3. **Begin scaffolding** - Start with Prisma schema (simplified), then Next.js project structure
4. **Implement in order** - Follow simplified implementation plan (18–20 days)

---

## Questions for Clarification

Please review and confirm:

1. ✅ **Profile types removed**: Is it okay to have single UI for all learners in MVP?
2. ✅ **Task counts everywhere**: Confirm "8 of 10 tasks" language is clear for 6–9 year olds
3. ✅ **Fixed points (10 per task)**: Tutors cannot customize point values - acceptable?
4. ✅ **Tasks locked after activation**: No mid-week edits - acceptable trade-off for simplicity?
5. ✅ **"Copy Last Week" prominent**: This saves tutors 13 min/week - priority correct?

**If all confirmed, ready to begin implementation with 20–25% time savings!**
