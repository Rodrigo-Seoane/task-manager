/**
 * Learner Login API Route
 * POST /api/auth/learner/login
 * Phase 4.1 - Learner Authentication with rate limiting
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// In-memory store for rate limiting (in production, use Redis)
const loginAttempts = new Map<
  string,
  { count: number; lastAttempt: number; lockedUntil: number | null }
>();

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const LearnerLoginSchema = z.object({
  learnerId: z.string().uuid("Invalid learner ID"),
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only numbers"),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getAttemptKey(learnerId: string): string {
  return `learner:${learnerId}`;
}

function checkRateLimit(learnerId: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntil: number | null;
} {
  const key = getAttemptKey(learnerId);
  const now = Date.now();
  const attempts = loginAttempts.get(key);

  if (!attempts) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Check if lockout has expired
  if (attempts.lockedUntil && now >= attempts.lockedUntil) {
    // Reset after lockout expires
    loginAttempts.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Still locked out
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: attempts.lockedUntil,
    };
  }

  // Check attempt count
  const remainingAttempts = MAX_ATTEMPTS - attempts.count;
  return {
    allowed: remainingAttempts > 0,
    remainingAttempts: Math.max(0, remainingAttempts),
    lockedUntil: null,
  };
}

function recordFailedAttempt(learnerId: string): {
  remainingAttempts: number;
  lockedUntil: number | null;
} {
  const key = getAttemptKey(learnerId);
  const now = Date.now();
  const attempts = loginAttempts.get(key) || {
    count: 0,
    lastAttempt: now,
    lockedUntil: null,
  };

  attempts.count += 1;
  attempts.lastAttempt = now;

  // Lock out after MAX_ATTEMPTS
  if (attempts.count >= MAX_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  loginAttempts.set(key, attempts);

  return {
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - attempts.count),
    lockedUntil: attempts.lockedUntil,
  };
}

function clearAttempts(learnerId: string): void {
  const key = getAttemptKey(learnerId);
  loginAttempts.delete(key);
}

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedFields = LearnerLoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { learnerId, pin } = validatedFields.data;

    // Check rate limiting
    const rateLimit = checkRateLimit(learnerId);

    if (!rateLimit.allowed) {
      const minutesRemaining = rateLimit.lockedUntil
        ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 60000)
        : 30;

      return NextResponse.json(
        {
          error: "Too many tries. Ask your tutor for help.",
          lockedUntil: rateLimit.lockedUntil,
          minutesRemaining,
        },
        { status: 429 }
      );
    }

    // Fetch learner
    const learner = await prisma.learner.findUnique({
      where: { id: learnerId },
      select: {
        id: true,
        displayName: true,
        pinCode: true,
        tutorId: true,
      },
    });

    if (!learner) {
      // Record failed attempt even for non-existent learner
      const result = recordFailedAttempt(learnerId);

      return NextResponse.json(
        {
          error: "Oops! Wrong PIN. Try again or ask your tutor.",
          remainingAttempts: result.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Verify PIN
    if (pin !== learner.pinCode) {
      const result = recordFailedAttempt(learnerId);

      if (result.lockedUntil) {
        return NextResponse.json(
          {
            error: "Too many tries. Ask your tutor for help.",
            lockedUntil: result.lockedUntil,
            minutesRemaining: 30,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "Oops! Wrong PIN. Try again or ask your tutor.",
          remainingAttempts: result.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success - clear failed attempts
    clearAttempts(learnerId);

    // Return learner data for client-side session creation
    return NextResponse.json(
      {
        success: true,
        learner: {
          id: learner.id,
          displayName: learner.displayName,
          tutorId: learner.tutorId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LEARNER_LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
