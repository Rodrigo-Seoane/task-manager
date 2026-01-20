/**
 * Review Completions Page
 * Route: /tutor/review/[learnerId]
 * Allows tutors to approve or reject task completions
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/tutor/Navigation";
import { ReviewCompletionsClient } from "@/components/tutor/ReviewCompletionsClient";
import Link from "next/link";

// Type for learner with weekly cycles and completions
type LearnerWithCompletions = {
  id: string;
  displayName: string;
  weeklyCycles: {
    id: string;
    tasks: {
      id: string;
      title: string;
      iconName: string | null;
      isBossTask: boolean;
      completions: {
        id: string;
        pointsAwarded: number;
        completedAt: Date;
      }[];
    }[];
  }[];
};

interface PageProps {
  params: Promise<{
    learnerId: string;
  }>;
}

export default async function ReviewCompletionsPage({ params }: PageProps) {
  const session = await auth();

  // Redirect if not authenticated or not a tutor
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  const tutorId = session.user.id;
  const { learnerId } = await params;

  // Fetch learner with pending completions
  const learner = await prisma.learner.findFirst({
    where: {
      id: learnerId,
      tutorId,
    },
    include: {
      weeklyCycles: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          tasks: {
            orderBy: {
              isBossTask: "asc",
            },
            include: {
              completions: {
                where: {
                  tutorApproved: null, // Only pending completions
                },
                orderBy: {
                  completedAt: "asc",
                },
              },
            },
          },
        },
      },
    },
  }) as LearnerWithCompletions | null;

  if (!learner) {
    redirect("/tutor/dashboard");
  }

  const currentCycle = learner.weeklyCycles[0];

  // Get all pending completions
  const pendingCompletions = currentCycle?.tasks.flatMap((task) =>
    task.completions.map((completion) => ({
      id: completion.id,
      taskId: task.id,
      taskTitle: task.title,
      taskIcon: task.iconName,
      isBossTask: task.isBossTask,
      pointsAwarded: completion.pointsAwarded,
      completedAt: completion.completedAt,
    }))
  ) || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-grey-50)",
      }}
    >
      <Navigation tutorName={session.user.name || "Tutor"} />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "var(--space-8)",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <Link
            href="/tutor/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--color-navy-600)",
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
              textDecoration: "none",
              marginBottom: "var(--space-4)",
            }}
          >
            ← Back to Dashboard
          </Link>

          <h1
            style={{
              fontSize: "var(--font-size-h1)",
              fontFamily: "var(--font-family-display)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-2)",
            }}
          >
            Review {learner.displayName}&apos;s Tasks
          </h1>

          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
            }}
          >
            {pendingCompletions.length === 0
              ? "No tasks pending review"
              : `${pendingCompletions.length} task${pendingCompletions.length !== 1 ? "s" : ""} pending review`}
          </p>
        </div>

        {/* Completions List */}
        {pendingCompletions.length > 0 ? (
          <ReviewCompletionsClient
            completions={pendingCompletions}
            learnerName={learner.displayName}
          />
        ) : (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-12)",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>
              ✅
            </div>
            <p
              style={{
                fontSize: "var(--font-size-h4)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-grey-600)",
              }}
            >
              All caught up! No tasks to review.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
