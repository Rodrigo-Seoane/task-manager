/**
 * Task Detail API Route
 * DELETE /api/tasks/[id] - Delete a task
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

export async function DELETE(
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
    const { id: taskId } = await params;

    // Verify task exists and belongs to tutor's learner
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        weeklyCycle: {
          include: {
            learner: true,
          },
        },
        completions: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (task.weeklyCycle.learner.tutorId !== tutorId) {
      return NextResponse.json(
        { error: "Task does not belong to this tutor" },
        { status: 403 }
      );
    }

    // Check if cycle is locked (status = ACTIVE)
    if (task.weeklyCycle.status === "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "Tasks are locked for this week. You can edit next week's tasks or end this week early.",
        },
        { status: 400 }
      );
    }

    // Warn if task has completions (shouldn't happen in DRAFT, but check anyway)
    if (task.completions.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete task with existing completions. Task has been completed by learner.",
        },
        { status: 400 }
      );
    }

    // Delete task
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_TASK_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
