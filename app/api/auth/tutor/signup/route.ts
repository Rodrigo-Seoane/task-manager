/**
 * Tutor Signup API Route
 * POST /api/auth/tutor/signup
 */

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
});

// ============================================================================
// ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedFields = SignupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, fullName } = validatedFields.data;

    // Check if tutor already exists
    const existingTutor = await prisma.tutor.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingTutor) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create tutor
    const tutor = await prisma.tutor.create({
      data: {
        email,
        passwordHash,
        fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        tutor: {
          id: tutor.id,
          email: tutor.email,
          fullName: tutor.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TUTOR_SIGNUP_ERROR]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
