/**
 * Activate Weekly Cycle API Route
 * POST /api/weekly-cycles/[id]/activate
 * Phase 3.2 - Activate Weekly Cycle
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: cycleId } = await params;

    // Fetch cycle and verify ownership
    const cycle = await prisma.weeklyCycle.findFirst({
      where: {
        id: cycleId,
      },
      include: {
        learner: true,
        tasks: true,
      },
    });

    if (!cycle) {
      return NextResponse.json(
        { error: "Weekly cycle not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (cycle.learner.tutorId !== tutorId) {
      return NextResponse.json(
        { error: "Weekly cycle does not belong to this tutor" },
        { status: 403 }
      );
    }

    // Check if already active
    if (cycle.status === "ACTIVE") {
      return NextResponse.json(
        { error: "Weekly cycle is already active" },
        { status: 400 }
      );
    }

    // Check if cycle has at least one task
    if (cycle.tasks.length === 0) {
      return NextResponse.json(
        { error: "Cannot activate cycle with no tasks. Please add at least one task." },
        { status: 400 }
      );
    }

    // Check for existing ACTIVE cycle for this learner
    const existingActiveCycle = await prisma.weeklyCycle.findFirst({
      where: {
        learnerId: cycle.learnerId,
        status: "ACTIVE",
        id: {
          not: cycleId,
        },
      },
    });

    if (existingActiveCycle) {
      return NextResponse.json(
        {
          error:
            "An active weekly cycle already exists for this learner. Complete or end the current cycle before activating a new one.",
        },
        { status: 409 }
      );
    }

    // Activate the cycle
    const updatedCycle = await prisma.weeklyCycle.update({
      where: {
        id: cycleId,
      },
      data: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json(
      {
        message: "Weekly cycle activated successfully. Learner can now start completing tasks!",
        weeklyCycle: updatedCycle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ACTIVATE_WEEKLY_CYCLE_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
