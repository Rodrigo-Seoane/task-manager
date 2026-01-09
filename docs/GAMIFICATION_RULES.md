# Board Master - Gamification Rules & Logic (SIMPLIFIED MVP)

## Task Count Calculation (PRIMARY)

### Count-Based Progress (Shown to Children)
```
total_task_completions_needed = SUM(
  task.frequency_per_week
  WHERE is_boss_task = false
  AND weekly_cycle_id = X
)

total_tasks_completed = COUNT(
  task_completions
  WHERE weekly_cycle_id = X
  AND task.is_boss_task = false
  AND tutor_approved != false
)

completion_ratio = total_tasks_completed / total_task_completions_needed

# Display to learner
completion_text = "{total_tasks_completed} of {total_task_completions_needed} tasks done!"

# Boss unlock check
boss_unlocked = (completion_ratio >= 0.80)
```

**KEY CHANGE**: Progress is count-based ("8 of 10 tasks done"), NOT percentage-based ("80%").

---

## Weekly Point Calculation (SECONDARY)

### Simplified Point Formula
```
# Points are fixed: 10 per regular task, 0 per boss task
total_possible_points = total_task_completions_needed × 10

total_earned_points = total_tasks_completed × 10

# Points tracked but NOT shown prominently to children
# Used for lifetime point accumulation only
```

### Fixed Point Values
```
IF is_boss_task = false THEN
  point_value = 10  # FIXED, not editable by tutor

IF is_boss_task = true THEN
  point_value = 0   # FIXED, not editable by tutor
```

### Tutor Approval Effect
```
ON tutor_review:
  IF tutor_approved = true OR tutor_approved = null THEN
    # Count task as completed
    total_tasks_completed += 1
    points_awarded = 10

  IF tutor_approved = false THEN
    # Do not count task
    total_tasks_completed -= 1 (if previously counted)
    points_awarded = 0
```

---

## Level 1 Rules (HIDDEN FROM UI)

### Constants
```
MAX_WEEKLY_TASKS = 12
MAX_BOSS_TASKS = 2
UNLOCK_THRESHOLD = 0.80  # 80% by count
```

**REMOVED**: `LEVEL_NUMBER`, `LEVEL_TITLE`, `POINTS_REQUIRED` - Not shown in UI

### Task Creation Constraints
```
ON create_task(weekly_cycle):
  existing_tasks = COUNT(tasks WHERE weekly_cycle_id = cycle.id)

  IF existing_tasks >= MAX_WEEKLY_TASKS THEN
    RAISE error("Maximum 12 tasks per week")
    # Do NOT mention "Level 1" in error message

  IF task.is_boss_task = true THEN
    existing_boss_tasks = COUNT(
      tasks
      WHERE weekly_cycle_id = cycle.id
      AND is_boss_task = true
    )

    IF existing_boss_tasks >= MAX_BOSS_TASKS THEN
      RAISE error("Maximum 2 Boss Tasks per week")
      # Do NOT mention "Level 1" in error message
```

### Level Progression
```
# No level display or progression in MVP
# Level concept hidden from users
# Enforce limits silently
```

---

## Boss Task Unlock Conditions

### Unlock Check (Run after each task completion)
```
FUNCTION check_boss_unlock(weekly_cycle):
  total_tasks_completed = COUNT(
    task_completions
    WHERE weekly_cycle_id = cycle.id
    AND task.is_boss_task = false
    AND tutor_approved != false
  )

  total_tasks_needed = SUM(
    task.frequency_per_week
    WHERE weekly_cycle_id = cycle.id
    AND is_boss_task = false
  )

  completion_ratio = total_tasks_completed / total_tasks_needed

  IF completion_ratio >= 0.80 THEN
    weekly_cycle.boss_task_unlocked = true
    IF NOT previously_unlocked THEN
      TRIGGER wizard_message("Boss Tasks Unlocked!")
  ELSE
    weekly_cycle.boss_task_unlocked = false
```

**KEY CHANGE**: Uses task count ratio, not point percentage.

### Boss Task Completion Validation
```
FUNCTION can_complete_boss_task(task, weekly_cycle):
  IF task.is_boss_task = false THEN
    RETURN true

  IF weekly_cycle.boss_task_unlocked = false THEN
    # Calculate how many more tasks needed
    tasks_completed = COUNT(completions WHERE is_boss_task = false)
    tasks_needed = CEILING(total_tasks_needed × 0.80)
    remaining = tasks_needed - tasks_completed
    RETURN false, "Complete {remaining} more tasks to unlock Boss Tasks!"

  completed_boss_tasks = COUNT(
    task_completions
    WHERE weekly_cycle_id = cycle.id
    AND task.is_boss_task = true
  )

  IF completed_boss_tasks >= MAX_BOSS_TASKS THEN
    RETURN false, "Already completed maximum Boss Tasks this week"

  RETURN true
```

### Boss Task Expiration
```
ON weekly_cycle_end:
  # Boss tasks do not carry over
  # New cycle creates new boss_task_unlocked = false
  # Must re-earn 80% threshold each week
```

---

## Task Completion Limits Per Week

### Frequency Enforcement
```
FUNCTION can_complete_task(task, weekly_cycle):
  completions_this_week = COUNT(
    task_completions
    WHERE task_id = task.id
    AND weekly_cycle_id = cycle.id
  )

  IF completions_this_week >= task.frequency_per_week THEN
    RETURN false, "Task completed maximum times this week"

  RETURN true
```

### Completion Date Validation
```
ON create_task_completion(task, learner):
  current_date = TODAY()
  active_cycle = GET weekly_cycle
    WHERE learner_id = learner.id
    AND status = ACTIVE

  IF active_cycle = null THEN
    RAISE error("No active weekly cycle")

  IF current_date < active_cycle.start_date THEN
    RAISE error("Cannot complete tasks before cycle starts")

  IF current_date > active_cycle.end_date THEN
    RAISE error("Weekly cycle has ended")

  IF NOT can_complete_task(task, active_cycle) THEN
    RAISE error("Task completion limit reached")

  IF task.is_boss_task AND NOT can_complete_boss_task(task, active_cycle) THEN
    RAISE error("Boss Task not yet unlocked")

  CREATE task_completion
  UPDATE active_cycle.total_earned_points
  RUN check_boss_unlock(active_cycle)
```

---

## Tutor Evaluation Flow

### Review Trigger
```
ON weekly_cycle_end_date:
  weekly_cycle.status = REVIEW
  NOTIFY tutor("Weekly review ready for {learner.display_name}")
```

### Review Process
```
FUNCTION tutor_review(weekly_cycle):
  pending_completions = GET task_completions
    WHERE weekly_cycle_id = cycle.id
    AND tutor_approved = null

  FOR EACH completion IN pending_completions:
    DISPLAY:
      - task.title
      - completion.completed_at
      - completion.points_awarded
      - learner notes/photo (if applicable)

    PROMPT tutor:
      - Approve (tutor_approved = true, keep points)
      - Reject (tutor_approved = false, remove points)
      - Skip (leave null, auto-approved)
```

### Completion Logic
```
ON tutor_submit_review(weekly_cycle):
  # Recalculate counts and points based on approvals
  approved_task_count = COUNT(
    task_completions
    WHERE weekly_cycle_id = cycle.id
    AND task.is_boss_task = false
    AND tutor_approved != false
  )

  approved_points = approved_task_count × 10

  weekly_cycle.total_earned_points = approved_points
  weekly_cycle.total_tasks_completed = approved_task_count
  weekly_cycle.status = COMPLETED
  weekly_cycle.tutor_reviewed_at = NOW()

  # Update learner lifetime points
  learner.total_points += approved_points

  # Trigger next cycle creation
  IF no cycle exists for next week THEN
    PROMPT tutor("Create next week's tasks?" WITH "Copy Last Week" option)
```

### Auto-Review Fallback
```
# If tutor doesn't review by end of week + 2 days:
ON weekly_cycle.end_date + 2 DAYS:
  IF weekly_cycle.status = REVIEW AND tutor_reviewed_at = null THEN
    # Auto-approve all pending completions
    UPDATE task_completions
      SET tutor_approved = true
      WHERE weekly_cycle_id = cycle.id
      AND tutor_approved = null

    weekly_cycle.status = COMPLETED
    weekly_cycle.tutor_reviewed_at = NOW()
```

---

## Visual Feedback Rules

### Progress Indicators (COUNT-BASED)
```
FUNCTION get_progress_color(completion_ratio):
  # completion_ratio = tasks_completed / tasks_needed

  IF completion_ratio < 0.40 THEN
    RETURN "red" # Needs work
    MESSAGE "Keep going! {remaining} tasks to go."

  IF completion_ratio < 0.70 THEN
    RETURN "yellow" # On track
    MESSAGE "Great start! {remaining} tasks to go."

  IF completion_ratio < 0.80 THEN
    RETURN "green" # Great progress
    MESSAGE "Almost there! {remaining} tasks to unlock Boss Tasks!"

  IF completion_ratio >= 0.80 THEN
    RETURN "gold" # Boss Task unlocked!
    MESSAGE "Boss Tasks unlocked! Great work!"
```

**KEY CHANGE**: Messages show tasks remaining (countable), not percentages.

### Celebration Triggers
```
ON task_completion:
  SHOW animation("✓ Task complete!")
  # De-emphasize points in celebration

  IF completion_ratio >= 0.80 AND NOT boss_task_unlocked_shown THEN
    SHOW wizard_animation("Boss Tasks Unlocked!")
    SET boss_task_unlocked_shown = true

ON boss_task_completion:
  SHOW celebration_animation("Boss Task Complete!")
  # NO tutor notification for boss task (reduces interruptions)

ON weekly_cycle_complete:
  tasks_completed = COUNT(completions)
  tasks_needed = SUM(frequencies)

  IF completion_ratio >= 0.80 THEN
    SHOW wizard_message("Amazing! You completed {tasks_completed} of {tasks_needed} tasks!")
  ELSE
    SHOW wizard_message("Good effort! You completed {tasks_completed} tasks. Try for {CEILING(tasks_needed × 0.80)} next week!")
```

**KEY CHANGES**:
- Removed push notification for boss task completion (reduces tutor notification fatigue)
- Messages use concrete task counts instead of percentages

---

## Edge Cases & Business Logic

### Mid-Week Task Changes
```
# REMOVED IN MVP: Tasks are LOCKED once cycle is ACTIVE
ON attempt_task_edit_mid_week(weekly_cycle):
  IF weekly_cycle.status = ACTIVE THEN
    SHOW error("Tasks are locked for this week. You can edit next week's tasks or end this week early.")
    PROVIDE options:
      - "Create Next Week" (doesn't affect current week)
      - "End Week Early" (triggers review now)
      - "Cancel"

# Rationale: Prevents edge cases, confusion for learners, and recalculation bugs
```

### Multiple Learners Same Week
```
# Each learner has independent cycles
# No shared points or cross-learner mechanics in MVP
FOR EACH learner IN tutor.learners:
  weekly_cycles are independent
  progress is not compared
  reviews happen separately
```

### Task Completion Without Internet
```
# Future consideration - not in MVP
# MVP requires online access to complete tasks
# No offline sync in v1
```

### Timezone Handling
```
# Use tutor's timezone for weekly cycle boundaries
# Weekly cycles start Monday 00:00:00 in tutor timezone
# End Sunday 23:59:59 in tutor timezone
weekly_cycle.start_date = next_monday_at_midnight(tutor.timezone)
weekly_cycle.end_date = following_sunday_at_end_of_day(tutor.timezone)
```

---

## Gamification Anti-Patterns to Avoid

### Explicit Rules
```
NO infinite scrolling in learner view
NO random reward mechanics (loot boxes)
NO comparison between learners (leaderboards)
NO daily login bonuses unrelated to tasks
NO push notifications for guilt/urgency
NO point purchases or pay-to-win mechanics
NO streak anxiety (missing one day doesn't reset progress)
NO dark patterns (fake urgency, hidden costs)
```

### Positive Constraints
```
YES clear progress visibility (task counts, not percentages)
YES predictable reward schedule (80% threshold known upfront)
YES natural consequences (no boss task if < 80%)
YES task completion limits (prevents grinding)
YES tutor oversight and validation (with auto-approve fallback)
YES age-appropriate language and visuals (1st-grade reading level)
YES weekly reset (fresh start every Monday)
YES no push notifications (email only for weekly review)
```

---

## Summary of MVP Simplifications

1. ✅ **Count-based progress**: "8 of 10 tasks done" instead of "80%"
2. ✅ **Fixed point values**: 10 points per task (no customization)
3. ✅ **Boss unlock by count**: 80% of task count, not point percentage
4. ✅ **No mid-week edits**: Tasks locked once activated
5. ✅ **Level hidden**: Enforce limits without showing "Level 1" in UI
6. ✅ **No task types**: Just regular tasks and boss tasks (no Habit/Activity distinction)
7. ✅ **Reduced notifications**: Email only for weekly review, no push for task completions
8. ✅ **"Copy Last Week" button**: Reduces tutor task creation time from 15 min to 2 min
9. ✅ **Expectation field**: Tutors can define "what does done look like?" for each task

These changes make the system simpler for children to understand, faster for tutors to manage, and easier to implement/test.
