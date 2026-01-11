/**
 * Tutor Dashboard Page
 * Route: /tutor/dashboard
 * Main landing page for tutors after login
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/tutor/Navigation";
import { LearnerCard } from "@/components/tutor/LearnerCard";
import Link from "next/link";

export default async function TutorDashboardPage() {
  const session = await auth();

  // Redirect if not authenticated or not a tutor
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  // Fetch tutor with learners
  const tutor = await prisma.tutor.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      learners: {
        select: {
          id: true,
          displayName: true,
          totalPoints: true,
          weeklyCycles: {
            where: {
              status: {
                in: ["ACTIVE", "REVIEW"],
              },
            },
            orderBy: {
              startDate: "desc",
            },
            take: 1,
            select: {
              id: true,
              status: true,
              tasks: {
                where: {
                  isBossTask: false,
                },
                select: {
                  id: true,
                  frequencyPerWeek: true,
                  pointValue: true,
                  completions: {
                    select: {
                      id: true,
                      pointsAwarded: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tutor) {
    redirect("/tutor/login");
  }

  // Transform learner data for cards
  const learners = tutor.learners.map((learner) => {
    const currentCycle = learner.weeklyCycles[0];

    if (!currentCycle) {
      return {
        id: learner.id,
        displayName: learner.displayName,
        totalPoints: learner.totalPoints,
        currentCycle: null,
      };
    }

    // Calculate totals
    const totalTasks = currentCycle.tasks.reduce(
      (sum, task) => sum + task.frequencyPerWeek,
      0
    );
    const tasksCompleted = currentCycle.tasks.reduce(
      (sum, task) => sum + task.completions.length,
      0
    );
    const pointsThisWeek = currentCycle.tasks.reduce(
      (sum, task) =>
        sum +
        task.completions.reduce((s, c) => s + c.pointsAwarded, 0),
      0
    );

    return {
      id: learner.id,
      displayName: learner.displayName,
      totalPoints: learner.totalPoints,
      currentCycle: {
        status: currentCycle.status,
        tasksCompleted,
        totalTasks,
        pointsThisWeek,
      },
    };
  });

  const hasLearners = learners.length > 0;
  const canAddMore = learners.length < 4;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-mist-50)" }}
    >
      {/* Navigation */}
      <Navigation tutorName={tutor.fullName} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h1)",
              lineHeight: "var(--line-height-h1)",
              color: "var(--color-navy-800)",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-grey-600)",
            }}
          >
            Manage your learners and their weekly tasks
          </p>
        </div>

        {/* Add Learner Button */}
        {canAddMore && (
          <div className="mb-6">
            <Link
              href="/tutor/learners/add"
              className="inline-block px-6 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: "var(--color-peach-500)",
                color: "white",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              + Add Learner
            </Link>
          </div>
        )}

        {/* Learners Grid */}
        {hasLearners ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learners.map((learner) => (
              <LearnerCard key={learner.id} learner={learner} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="rounded-lg p-12 text-center"
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "var(--color-mist-100)",
                fontSize: "40px",
              }}
            >
              👥
            </div>
            <h3
              className="mb-2"
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
              }}
            >
              No learners yet
            </h3>
            <p
              className="mb-6"
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
              }}
            >
              Add your first learner to get started with Board Master
            </p>
            <Link
              href="/tutor/learners/add"
              className="inline-block px-6 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: "var(--color-navy-500)",
                color: "white",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Add Your First Learner
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
