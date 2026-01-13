/**
 * Test API Route - Verify Prisma Connection
 * Access at: http://localhost:3002/api/test
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection by running a simple query
    const tutorCount = await prisma.tutor.count();
    const learnerCount = await prisma.learner.count();
    const cycleCount = await prisma.weeklyCycle.count();
    const taskCount = await prisma.task.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      database: {
        tutors: tutorCount,
        learners: learnerCount,
        weeklyCycles: cycleCount,
        tasks: taskCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
