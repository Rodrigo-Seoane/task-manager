/**
 * Week Review Message Page
 * Route: /learner/week-review
 * Phase 4.2 - Shown when weekly_cycle.status = REVIEW
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WeekReviewClient } from "@/components/learner/WeekReviewClient";
import { Prisma } from "@prisma/client";

// Define the type for the review cycle with completions
type ReviewCycleWithCompletions = Prisma.WeeklyCycleGetPayload<{
  include: {
    taskCompletions: true;
  };
}>;

export default async function LearnerWeekReviewPage() {
  const session = await auth();

  // Must be logged in as learner
  if (!session || session.user.role !== "learner") {
    redirect("/learner/select");
  }

  const learnerId = session.user.id;

  // Fetch learner data
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    select: {
      id: true,
      displayName: true,
    },
  });

  if (!learner) {
    redirect("/learner/select");
  }

  // Check for review cycle
  const reviewCycleQuery = await prisma.weeklyCycle.findFirst({
    where: {
      learnerId,
      status: "REVIEW",
    },
    include: {
      taskCompletions: {
        where: {
          learnerId,
        },
      },
    },
  }) as ReviewCycleWithCompletions | null;

  // If no review cycle, check for active
  if (!reviewCycleQuery) {
    const activeCycle = await prisma.weeklyCycle.findFirst({
      where: {
        learnerId,
        status: "ACTIVE",
      },
    });

    if (activeCycle) {
      redirect("/learner/dashboard");
    }

    redirect("/learner/waiting");
  }

  const reviewCycle = reviewCycleQuery;
  const tasksCompleted = reviewCycle.taskCompletions.length;

  return (
    <WeekReviewClient
      learnerName={learner.displayName}
      tasksCompleted={tasksCompleted}
    />
  );
}
