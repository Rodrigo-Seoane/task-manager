/**
 * Learner Onboarding API Route
 * Phase 6 - Narrative System
 *
 * POST /api/learner/onboarding
 * Marks the learner's onboarding as completed (first login wizard shown)
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "learner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark onboarding as completed
    await prisma.learner.update({
      where: { id: session.user.id },
      data: { onboardingCompleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LEARNER_ONBOARDING_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update onboarding status" },
      { status: 500 }
    );
  }
}
