/**
 * Weekly Cycle Utilities
 * Phase 5.1 - Weekly Cycle Transition
 *
 * Handles automatic transition of weekly cycles:
 * - ACTIVE → REVIEW when end_date has passed
 */

import { prisma } from "@/lib/prisma";

/**
 * Transitions all ACTIVE weekly cycles to REVIEW status
 * when their end_date has passed.
 *
 * Called on tutor dashboard page load (temporary for MVP).
 * Later can be moved to a cron job.
 *
 * @returns Number of cycles transitioned
 */
export async function transitionWeeklyCycles(): Promise<number> {
  const now = new Date();

  // Find all ACTIVE cycles where end_date has passed
  const result = await prisma.weeklyCycle.updateMany({
    where: {
      status: "ACTIVE",
      endDate: {
        lt: now,
      },
    },
    data: {
      status: "REVIEW",
    },
  });

  return result.count;
}
