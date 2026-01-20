/**
 * Learners API Route
 * POST /api/learners - Create new learner
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const CreateLearnerSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters"),
  pinCode: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only numbers"),
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

    // Check learner limit (max 4 per tutor)
    const learnerCount = await prisma.learner.count({
      where: { tutorId },
    });

    if (learnerCount >= 4) {
      return NextResponse.json(
        { error: "Maximum of 4 learners per tutor reached" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedFields = CreateLearnerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { displayName, pinCode } = validatedFields.data;

    // Check for duplicate PIN within tutor's learners
    const existingLearnerWithPin = await prisma.learner.findFirst({
      where: {
        tutorId,
        pinCode,
      },
    });

    if (existingLearnerWithPin) {
      return NextResponse.json(
        {
          error:
            "This PIN is already used by another learner. Please choose a different PIN.",
        },
        { status: 409 }
      );
    }

    // Create learner
    const learner = await prisma.learner.create({
      data: {
        tutorId,
        displayName,
        pinCode,
      },
      select: {
        id: true,
        displayName: true,
        totalPoints: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Learner created successfully",
        learner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE_LEARNER_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
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

    // Fetch all learners for this tutor
    const learners = await prisma.learner.findMany({
      where: { tutorId },
      select: {
        id: true,
        displayName: true,
        totalPoints: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ learners }, { status: 200 });
  } catch (error) {
    console.error("[GET_LEARNERS_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
