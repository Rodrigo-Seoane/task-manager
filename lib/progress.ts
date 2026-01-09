/**
 * Progress Calculation Utilities
 * Based on docs/GAMIFICATION_RULES.md - Count-based progress (not percentage)
 */

import { BOSS_UNLOCK_THRESHOLD } from "./constants";

export interface TaskWithCompletions {
  frequencyPerWeek: number;
  isBossTask: boolean;
  completions: { tutorApproved: boolean | null }[];
}

export interface ProgressStats {
  totalTasksNeeded: number;
  totalTasksCompleted: number;
  completionRatio: number;
  bossUnlocked: boolean;
  progressText: string;
  tasksRemainingForBoss: number;
}

/**
 * Calculate count-based progress for a weekly cycle
 *
 * Primary calculation per DATA_MODELS.md:
 * - total_task_completions_needed = SUM(task.frequency_per_week WHERE is_boss_task = false)
 * - total_tasks_completed = COUNT(task_completions WHERE is_boss_task = false AND tutor_approved != false)
 * - completion_text = "{total_tasks_completed} of {total_task_completions_needed} tasks done!"
 * - boss_unlocked = (completion_ratio >= 0.80)
 */
export function calculateProgress(tasks: TaskWithCompletions[]): ProgressStats {
  // Calculate total tasks needed (sum of all regular task frequencies)
  const totalTasksNeeded = tasks
    .filter((task) => !task.isBossTask)
    .reduce((sum, task) => sum + task.frequencyPerWeek, 0);

  // Calculate total tasks completed (count approved completions, exclude rejected)
  const totalTasksCompleted = tasks
    .filter((task) => !task.isBossTask)
    .reduce((sum, task) => {
      const approvedCount = task.completions.filter(
        (c) => c.tutorApproved !== false
      ).length;
      return sum + approvedCount;
    }, 0);

  // Calculate completion ratio
  const completionRatio =
    totalTasksNeeded > 0 ? totalTasksCompleted / totalTasksNeeded : 0;

  // Boss tasks unlock at 80% by count
  const bossUnlocked = completionRatio >= BOSS_UNLOCK_THRESHOLD;

  // Calculate how many more tasks needed for boss unlock
  const tasksNeededForBoss = Math.ceil(totalTasksNeeded * BOSS_UNLOCK_THRESHOLD);
  const tasksRemainingForBoss = Math.max(
    0,
    tasksNeededForBoss - totalTasksCompleted
  );

  // Generate progress text (count-based, not percentage)
  const progressText = `${totalTasksCompleted} of ${totalTasksNeeded} tasks done!`;

  return {
    totalTasksNeeded,
    totalTasksCompleted,
    completionRatio,
    bossUnlocked,
    progressText,
    tasksRemainingForBoss,
  };
}

/**
 * Generate wizard encouragement message based on progress
 */
export function getProgressMessage(stats: ProgressStats): string {
  if (stats.bossUnlocked) {
    return "Amazing! You unlocked the Boss Tasks!";
  }

  if (stats.tasksRemainingForBoss === 1) {
    return "Complete 1 more task to unlock Boss Tasks!";
  }

  if (stats.tasksRemainingForBoss <= 3) {
    return `Complete ${stats.tasksRemainingForBoss} more tasks to unlock Boss Tasks!`;
  }

  if (stats.completionRatio >= 0.5) {
    return "You're doing great! Keep going!";
  }

  if (stats.totalTasksCompleted > 0) {
    return "Great start! Keep completing tasks!";
  }

  return "Tap a task to get started!";
}

/**
 * Generate progress bar color based on completion ratio
 */
export function getProgressColor(ratio: number): string {
  if (ratio >= 0.8) return "gold"; // Boss unlocked
  if (ratio >= 0.7) return "green"; // Almost there
  if (ratio >= 0.4) return "yellow"; // Making progress
  return "red"; // Just started
}

/**
 * Calculate total points earned in a weekly cycle
 */
export function calculateTotalPoints(tasks: TaskWithCompletions[]): number {
  return tasks.reduce((total, task) => {
    const approvedCompletions = task.completions.filter(
      (c) => c.tutorApproved !== false
    ).length;

    // Regular tasks: 10 points each
    // Boss tasks: 0 points (rewards are non-point based)
    const pointsPerTask = task.isBossTask ? 0 : 10;

    return total + approvedCompletions * pointsPerTask;
  }, 0);
}
