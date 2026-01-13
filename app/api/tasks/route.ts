/**
 * Tasks API Route
 * POST /api/tasks - Create new task within a weekly cycle
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// CONSTANTS (Level 1 Rules - Hidden from UI)
// ============================================================================

const MAX_WEEKLY_TASKS = 12;
const MAX_BOSS_TASKS = 2;
const REGULAR_TASK_POINTS = 10;
const BOSS_TASK_POINTS = 0;

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const CreateTaskSchema = z.object({
  weeklyCycleId: z.string().uuid("Invalid weekly cycle ID"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(50, "Task title must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  iconName: z.string().optional(),
  frequencyPerWeek: z
    .number()
    .int("Frequency must be a whole number")
    .min(1, "Frequency must be at least 1")
    .max(14, "Frequency cannot exceed 14 (twice per day for a week)"),
  isBossTask: z.boolean().default(false),
  expectation: z
    .string()
    .max(200, "Expectation must be less than 200 characters")
    .optional(),
});

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || session.user.role !== "tutor") {
      return NextResponse.json(
        { error: "Unauthorized. Tutor login required." },
        { status: 401 }
      );
    }

    const tutorId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = CreateTaskSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      weeklyCycleId,
      title,
      description,
      iconName,
      frequencyPerWeek,
      isBossTask,
      expectation,
    } = validatedFields.data;

    // Verify weekly cycle exists and belongs to tutor's learner
    const weeklyCycle = await prisma.weeklyCycle.findFirst({
      where: {
        id: weeklyCycleId,
        learner: {
          tutorId,
        },
      },
      include: {
        tasks: true,
      },
    });

    if (!weeklyCycle) {
      return NextResponse.json(
        { error: "Weekly cycle not found or does not belong to this tutor" },
        { status: 404 }
      );
    }

    // Check if cycle is locked (status = ACTIVE)
    if (weeklyCycle.status === "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "Tasks are locked for this week. You can edit next week's tasks or end this week early.",
        },
        { status: 400 }
      );
    }

    // Check max tasks limit (Level 1 rule)
    const existingTaskCount = weeklyCycle.tasks.length;

    if (existingTaskCount >= MAX_WEEKLY_TASKS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_WEEKLY_TASKS} tasks per week` },
        { status: 400 }
      );
    }

    // Check max boss tasks limit (Level 1 rule)
    if (isBossTask) {
      const existingBossTaskCount = weeklyCycle.tasks.filter(
        (task) => task.isBossTask
      ).length;

      if (existingBossTaskCount >= MAX_BOSS_TASKS) {
        return NextResponse.json(
          { error: `Maximum ${MAX_BOSS_TASKS} Boss Tasks per week` },
          { status: 400 }
        );
      }
    }

    // Set fixed point value based on task type
    const pointValue = isBossTask ? BOSS_TASK_POINTS : REGULAR_TASK_POINTS;

    // Create task
    const task = await prisma.task.create({
      data: {
        weeklyCycleId,
        title,
        description: description || null,
        iconName: iconName || null,
        pointValue,
        frequencyPerWeek,
        isBossTask,
        expectation: expectation || null,
      },
      select: {
        id: true,
        weeklyCycleId: true,
        title: true,
        description: true,
        iconName: true,
        pointValue: true,
        frequencyPerWeek: true,
        isBossTask: true,
        expectation: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Task created successfully",
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE_TASK_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
