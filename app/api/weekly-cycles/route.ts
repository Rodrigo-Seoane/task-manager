/**
 * Weekly Cycles API Route
 * POST /api/weekly-cycles - Create new weekly cycle
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const CreateWeeklyCycleSchema = z.object({
  learnerId: z.string().uuid("Invalid learner ID"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a date is a Monday
 */
function isMonday(date: Date): boolean {
  return date.getDay() === 1;
}

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
    const validatedFields = CreateWeeklyCycleSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { learnerId, startDate, endDate } = validatedFields.data;

    // Verify learner belongs to this tutor
    const learner = await prisma.learner.findFirst({
      where: {
        id: learnerId,
        tutorId,
      },
    });

    if (!learner) {
      return NextResponse.json(
        { error: "Learner not found or does not belong to this tutor" },
        { status: 404 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isMonday(start)) {
      return NextResponse.json(
        { error: "Start date must be a Monday" },
        { status: 400 }
      );
    }

    if (end.getDay() !== 0) {
      return NextResponse.json(
        { error: "End date must be a Sunday" },
        { status: 400 }
      );
    }

    const daysDifference = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference !== 6) {
      return NextResponse.json(
        { error: "Weekly cycle must be exactly 7 days (Monday to Sunday)" },
        { status: 400 }
      );
    }

    // Check for existing ACTIVE cycle for this learner
    const existingActiveCycle = await prisma.weeklyCycle.findFirst({
      where: {
        learnerId,
        status: "ACTIVE",
      },
    });

    if (existingActiveCycle) {
      return NextResponse.json(
        {
          error:
            "An active weekly cycle already exists for this learner. Complete or end the current cycle before creating a new one.",
        },
        { status: 409 }
      );
    }

    // Create weekly cycle
    const weeklyCycle = await prisma.weeklyCycle.create({
      data: {
        learnerId,
        startDate: start,
        endDate: end,
        status: "DRAFT",
      },
      select: {
        id: true,
        learnerId: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Weekly cycle created successfully",
        weeklyCycle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE_WEEKLY_CYCLE_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
