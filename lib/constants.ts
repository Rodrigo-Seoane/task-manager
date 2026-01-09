/**
 * Board Master - Game Constants
 * Based on docs/GAMIFICATION_RULES.md (Simplified MVP)
 */

// ============================================================================
// LEVEL 1 LIMITS (Hidden from UI in MVP)
// ============================================================================
export const MAX_WEEKLY_TASKS = 12;
export const MAX_BOSS_TASKS = 2;
export const MAX_LEARNERS_PER_TUTOR = 4;

// ============================================================================
// POINT VALUES (Fixed, Not Editable)
// ============================================================================
export const REGULAR_TASK_POINTS = 10;
export const BOSS_TASK_POINTS = 0;

// ============================================================================
// BOSS TASK UNLOCK THRESHOLD
// ============================================================================
export const BOSS_UNLOCK_THRESHOLD = 0.8; // 80% by task count

// ============================================================================
// FREQUENCY LIMITS
// ============================================================================
export const MIN_FREQUENCY_PER_WEEK = 1;
export const MAX_FREQUENCY_PER_WEEK = 14; // Up to twice per day

// ============================================================================
// VALIDATION LIMITS
// ============================================================================
export const MAX_TASK_TITLE_LENGTH = 50;
export const MAX_TASK_DESCRIPTION_LENGTH = 200;
export const MAX_TASK_EXPECTATION_LENGTH = 200;
export const MAX_LEARNER_NAME_LENGTH = 20;
export const MIN_LEARNER_NAME_LENGTH = 2;
export const LEARNER_PIN_LENGTH = 4;

// ============================================================================
// WEEKLY CYCLE TIMING
// ============================================================================
export const WEEK_START_DAY = 1; // Monday (0 = Sunday)
export const AUTO_REVIEW_GRACE_DAYS = 2; // Auto-approve after 2 days if tutor doesn't review

// ============================================================================
// CYCLE STATUS VALUES
// ============================================================================
export const CycleStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  REVIEW: "REVIEW",
  COMPLETED: "COMPLETED",
} as const;

export type CycleStatusType = keyof typeof CycleStatus;
