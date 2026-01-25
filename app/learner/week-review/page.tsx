/**
 * Week Review Message Page
 * Route: /learner/week-review
 * Phase 4.2 - Shown when weekly_cycle.status = REVIEW
 * Phase 6 - Enhanced data for narrative messages
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WeekReviewClient } from "@/components/learner/WeekReviewClient";
import { Prisma } from "@prisma/client";

// Define the type for the review cycle with completions and tasks
type ReviewCycleWithCompletionsAndTasks = Prisma.WeeklyCycleGetPayload<{
  include: {
    taskCompletions: true;
    tasks: true;
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

  // Check for review cycle - Phase 6: Include tasks for progress calculation
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
      tasks: true,
    },
  }) as ReviewCycleWithCompletionsAndTasks | null;

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

  // Phase 6: Calculate progress data for narrative messages
  const regularTasks = reviewCycle.tasks.filter((task) => !task.isBossTask);
  const bossTasks = reviewCycle.tasks.filter((task) => task.isBossTask);

  const totalCompletionsNeeded = regularTasks.reduce(
    (sum, task) => sum + task.frequencyPerWeek,
    0
  );

  const regularCompletions = reviewCycle.taskCompletions.filter((completion) =>
    regularTasks.some((task) => task.id === completion.taskId)
  );

  const bossCompletions = reviewCycle.taskCompletions.filter((completion) =>
    bossTasks.some((task) => task.id === completion.taskId)
  );

  const tasksCompleted = regularCompletions.length;
  const completionRatio = totalCompletionsNeeded > 0 ? tasksCompleted / totalCompletionsNeeded : 0;
  const reached80Percent = completionRatio >= 0.8;
  const completedBossTasks = bossCompletions.length > 0;

  // Calculate points earned (regular tasks only earn points)
  const pointsEarned = regularCompletions.reduce(
    (sum, completion) => sum + completion.pointsAwarded,
    0
  );

  return (
    <WeekReviewClient
      learnerName={learner.displayName}
      tasksCompleted={tasksCompleted}
      totalTasks={totalCompletionsNeeded}
      pointsEarned={pointsEarned}
      reached80Percent={reached80Percent}
      completedBossTasks={completedBossTasks}
    />
  );
}
