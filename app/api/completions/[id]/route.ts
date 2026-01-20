/**
 * Task Completion Approval API Route
 * PATCH /api/completions/[id] - Approve or reject a task completion
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const ApproveCompletionSchema = z.object({
  approved: z.boolean(),
});

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function PATCH(
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

    const { id: completionId } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(completionId)) {
      return NextResponse.json(
        { error: "Invalid completion ID format" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = ApproveCompletionSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { approved } = validatedFields.data;

    // Fetch completion with related data
    const completion = await prisma.taskCompletion.findUnique({
      where: { id: completionId },
      include: {
        task: {
          include: {
            weeklyCycle: {
              include: {
                learner: true,
              },
            },
          },
        },
        learner: true,
      },
    });

    if (!completion) {
      return NextResponse.json(
        { error: "Completion not found" },
        { status: 404 }
      );
    }

    // Verify the completion belongs to a learner owned by this tutor
    if (completion.task.weeklyCycle.learner.tutorId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to approve this completion" },
        { status: 403 }
      );
    }

    // Check if already reviewed
    if (completion.tutorApproved !== null) {
      return NextResponse.json(
        { error: "This completion has already been reviewed" },
        { status: 400 }
      );
    }

    // Update completion and learner points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the completion approval status
      const updatedCompletion = await tx.taskCompletion.update({
        where: { id: completionId },
        data: {
          tutorApproved: approved,
        },
      });

      // If approved, add points to learner's total
      if (approved && completion.pointsAwarded > 0) {
        await tx.learner.update({
          where: { id: completion.learnerId },
          data: {
            totalPoints: {
              increment: completion.pointsAwarded,
            },
          },
        });
      }

      return updatedCompletion;
    });

    return NextResponse.json({
      success: true,
      completion: {
        id: result.id,
        approved: result.tutorApproved,
        pointsAwarded: approved ? completion.pointsAwarded : 0,
      },
      message: approved
        ? `Approved! ${completion.pointsAwarded} points added.`
        : "Completion rejected.",
    });
  } catch (error) {
    console.error("[APPROVE_COMPLETION_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
