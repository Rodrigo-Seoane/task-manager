/**
 * Learner Dashboard Page
 * Route: /learner/dashboard
 * Phase 4.2 - Learner Dashboard Core
 * Phase 6 - Added onboarding status for first login wizard
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LearnerDashboardClient } from "@/components/learner/LearnerDashboardClient";
import { Prisma } from "@prisma/client";

// Define the type for our query result
type ActiveCycleWithRelations = Prisma.WeeklyCycleGetPayload<{
  include: {
    tasks: true;
    taskCompletions: true;
  };
}>;

export default async function LearnerDashboardPage() {
  const session = await auth();

  // Must be logged in as learner
  if (!session || session.user.role !== "learner") {
    redirect("/learner/login");
  }

  const learnerId = session.user.id;

  // Fetch learner basic data
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    select: {
      id: true,
      displayName: true,
      totalPoints: true,
      onboardingCompleted: true, // Phase 6: Check if first login wizard was shown
    },
  });

  if (!learner) {
    redirect("/learner/login");
  }

  // Check if cycle is in REVIEW status
  const reviewCycle = await prisma.weeklyCycle.findFirst({
    where: {
      learnerId,
      status: "REVIEW",
    },
  });

  if (reviewCycle) {
    redirect("/learner/week-review");
  }

  // Fetch active cycle with tasks and completions
  const activeCycleQuery = await prisma.weeklyCycle.findFirst({
    where: {
      learnerId,
      status: "ACTIVE",
    },
    include: {
      tasks: {
        orderBy: [
          { isBossTask: "asc" },
          { createdAt: "asc" },
        ],
      },
      taskCompletions: true,
    },
  }) as ActiveCycleWithRelations | null;

  // Check if no active cycle
  if (!activeCycleQuery) {
    redirect("/learner/waiting");
  }

  // activeCycleQuery is now guaranteed to be non-null after the redirect
  const activeCycle = activeCycleQuery;

  // Separate regular and boss tasks
  const regularTasks = activeCycle.tasks.filter((task) => !task.isBossTask);
  const bossTasks = activeCycle.tasks.filter((task) => task.isBossTask);

  // Calculate completions per task
  const completionsByTask = activeCycle.taskCompletions.reduce(
    (acc, completion) => {
      acc[completion.taskId] = (acc[completion.taskId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate progress (count-based)
  const totalCompletionsNeeded = regularTasks.reduce(
    (sum, task) => sum + task.frequencyPerWeek,
    0
  );

  const totalTasksCompleted = activeCycle.taskCompletions.filter((completion) =>
    regularTasks.some((task) => task.id === completion.taskId)
  ).length;

  // Determine boss unlock status
  const completionRatio =
    totalCompletionsNeeded > 0 ? totalTasksCompleted / totalCompletionsNeeded : 0;
  const bossUnlocked = completionRatio >= 0.8;
  const tasksToUnlock = Math.max(
    0,
    Math.ceil(totalCompletionsNeeded * 0.8) - totalTasksCompleted
  );

  // Sort regular tasks: incomplete first, then by creation date
  const sortedRegularTasks = [...regularTasks].sort((a, b) => {
    const aCompleted = (completionsByTask[a.id] || 0) >= a.frequencyPerWeek;
    const bCompleted = (completionsByTask[b.id] || 0) >= b.frequencyPerWeek;

    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1; // Incomplete first
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Phase 6: Check if first login wizard should be shown
  const showFirstLoginWizard = !learner.onboardingCompleted;

  return (
    <LearnerDashboardClient
      learner={{
        id: learner.id,
        displayName: learner.displayName,
        totalPoints: learner.totalPoints,
      }}
      showFirstLoginWizard={showFirstLoginWizard}
      regularTasks={sortedRegularTasks.map((task) => ({
        id: task.id,
        title: task.title,
        iconName: task.iconName,
        frequencyPerWeek: task.frequencyPerWeek,
        expectation: task.expectation,
        isBossTask: task.isBossTask,
      }))}
      bossTasks={bossTasks.map((task) => ({
        id: task.id,
        title: task.title,
        iconName: task.iconName,
        frequencyPerWeek: task.frequencyPerWeek,
        expectation: task.expectation,
        isBossTask: task.isBossTask,
      }))}
      completionsByTask={completionsByTask}
      progress={{
        completed: totalTasksCompleted,
        total: totalCompletionsNeeded,
        bossUnlocked,
        tasksToUnlock,
      }}
    />
  );
}
