/**
 * Complete Weekly Cycle Review API Route
 * POST /api/weekly-cycles/[id]/complete
 * Phase 5.3 - Finalize weekly review
 *
 * Sets cycle status to COMPLETED, records review timestamp,
 * and auto-approves any remaining pending completions.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const { id: cycleId } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(cycleId)) {
      return NextResponse.json(
        { error: "Invalid cycle ID format" },
        { status: 400 }
      );
    }

    // Fetch cycle with learner to verify ownership
    const cycle = await prisma.weeklyCycle.findUnique({
      where: { id: cycleId },
      include: {
        learner: true,
        tasks: {
          include: {
            completions: {
              where: {
                tutorApproved: null, // Pending completions
              },
            },
          },
        },
      },
    });

    if (!cycle) {
      return NextResponse.json(
        { error: "Weekly cycle not found" },
        { status: 404 }
      );
    }

    // Verify the cycle belongs to this tutor's learner
    if (cycle.learner.tutorId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to complete this review" },
        { status: 403 }
      );
    }

    // Check if cycle is in REVIEW or ACTIVE status (can complete either)
    if (cycle.status !== "REVIEW" && cycle.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This weekly cycle cannot be completed. Status must be ACTIVE or REVIEW." },
        { status: 400 }
      );
    }

    // Auto-approve any remaining pending completions and add points
    const pendingCompletions = cycle.tasks.flatMap((task) => task.completions);
    let pointsToAdd = 0;

    for (const completion of pendingCompletions) {
      pointsToAdd += completion.pointsAwarded;
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Auto-approve all pending completions
      if (pendingCompletions.length > 0) {
        await tx.taskCompletion.updateMany({
          where: {
            id: {
              in: pendingCompletions.map((c) => c.id),
            },
          },
          data: {
            tutorApproved: true,
          },
        });

        // Add points to learner
        if (pointsToAdd > 0) {
          await tx.learner.update({
            where: { id: cycle.learnerId },
            data: {
              totalPoints: {
                increment: pointsToAdd,
              },
            },
          });
        }
      }

      // Update cycle status to COMPLETED and set review timestamp
      await tx.weeklyCycle.update({
        where: { id: cycleId },
        data: {
          status: "COMPLETED",
          tutorReviewedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Weekly review completed successfully",
      autoApproved: pendingCompletions.length,
      pointsAwarded: pointsToAdd,
    });
  } catch (error) {
    console.error("[COMPLETE_REVIEW_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
