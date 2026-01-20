/**
 * Task Completion API Route
 * POST /api/tasks/complete
 * Phase 4.3 - Task Completion with validation
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// CONSTANTS
// ============================================================================

const REGULAR_TASK_POINTS = 10;
const BOSS_UNLOCK_THRESHOLD = 0.8;

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const CompleteTaskSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function calculateProgress(weeklyCycleId: string) {
  // Get all non-boss tasks with their frequencies
  const tasks = await prisma.task.findMany({
    where: {
      weeklyCycleId,
      isBossTask: false,
    },
    select: {
      id: true,
      frequencyPerWeek: true,
    },
  });

  // Calculate total completions needed
  const totalCompletionsNeeded = tasks.reduce(
    (sum, task) => sum + task.frequencyPerWeek,
    0
  );

  // Get count of completions for non-boss tasks
  const completions = await prisma.taskCompletion.count({
    where: {
      weeklyCycleId,
      task: {
        isBossTask: false,
      },
      tutorApproved: {
        not: false, // Include null (pending) and true (approved)
      },
    },
  });

  return {
    completed: completions,
    total: totalCompletionsNeeded,
    ratio: totalCompletionsNeeded > 0 ? completions / totalCompletionsNeeded : 0,
  };
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || session.user.role !== "learner") {
      return NextResponse.json(
        { error: "Unauthorized. Learner login required." },
        { status: 401 }
      );
    }

    const learnerId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = CompleteTaskSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { taskId } = validatedFields.data;

    // Fetch task with weekly cycle
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        weeklyCycle: {
          include: {
            learner: true,
          },
        },
        completions: {
          where: {
            learnerId,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify task belongs to this learner
    if (task.weeklyCycle.learnerId !== learnerId) {
      return NextResponse.json(
        { error: "Task does not belong to this learner" },
        { status: 403 }
      );
    }

    // Check if weekly cycle is active
    if (task.weeklyCycle.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "No active weekly cycle" },
        { status: 400 }
      );
    }

    // Note: We only check the end date, not the start date.
    // When a tutor activates a cycle, it becomes immediately playable.
    // The startDate is used for weekly cycle boundaries but not for blocking completion.
    // This allows tutors to activate cycles mid-week if needed.
    const now = new Date();
    const endDate = new Date(task.weeklyCycle.endDate);
    endDate.setHours(23, 59, 59, 999); // End of day

    if (now > endDate) {
      return NextResponse.json(
        { error: "Weekly cycle has ended" },
        { status: 400 }
      );
    }

    // Check frequency limit
    const completionsThisWeek = task.completions.length;
    if (completionsThisWeek >= task.frequencyPerWeek) {
      return NextResponse.json(
        { error: "Task completed maximum times this week" },
        { status: 400 }
      );
    }

    // Check once-per-day limit: only allow one completion per task per day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const completionsToday = task.completions.filter((completion) => {
      const completionDate = new Date(completion.completedAt);
      return completionDate >= todayStart && completionDate <= todayEnd;
    });

    if (completionsToday.length > 0) {
      return NextResponse.json(
        { error: "You already completed this task today. Come back tomorrow!" },
        { status: 400 }
      );
    }

    // Check boss task unlock if applicable
    if (task.isBossTask) {
      const progress = await calculateProgress(task.weeklyCycleId);

      if (progress.ratio < BOSS_UNLOCK_THRESHOLD) {
        const tasksNeeded = Math.ceil(progress.total * BOSS_UNLOCK_THRESHOLD);
        const tasksRemaining = tasksNeeded - progress.completed;

        return NextResponse.json(
          {
            error: `Complete ${tasksRemaining} more task${
              tasksRemaining !== 1 ? "s" : ""
            } to unlock Boss Tasks!`,
            tasksRemaining,
            isLocked: true,
          },
          { status: 400 }
        );
      }
    }

    // Calculate points (0 for boss tasks, 10 for regular)
    const pointsAwarded = task.isBossTask ? 0 : REGULAR_TASK_POINTS;

    // Create task completion
    const completion = await prisma.taskCompletion.create({
      data: {
        taskId,
        learnerId,
        weeklyCycleId: task.weeklyCycleId,
        pointsAwarded,
        tutorApproved: null, // Pending review
      },
    });

    // Calculate updated progress
    const updatedProgress = await calculateProgress(task.weeklyCycleId);
    const bossUnlocked = updatedProgress.ratio >= BOSS_UNLOCK_THRESHOLD;

    // Check if boss tasks were just unlocked
    const previousRatio =
      updatedProgress.total > 0
        ? (updatedProgress.completed - 1) / updatedProgress.total
        : 0;
    const justUnlockedBoss =
      bossUnlocked && previousRatio < BOSS_UNLOCK_THRESHOLD;

    return NextResponse.json(
      {
        success: true,
        completion: {
          id: completion.id,
          pointsAwarded,
        },
        progress: {
          completed: updatedProgress.completed,
          total: updatedProgress.total,
          ratio: updatedProgress.ratio,
          bossUnlocked,
          justUnlockedBoss,
        },
        message: task.isBossTask
          ? "Boss Task Complete!"
          : "Task complete!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[COMPLETE_TASK_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
