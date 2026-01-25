/**
 * Tutor Dashboard Page
 * Route: /tutor/dashboard
 * Main landing page for tutors after login
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-8, --space-10, --space-6)
 * - Used explicit radius tokens (--radius-lg, --radius-md, --radius-pill)
 * - Increased button height for better touch targets (48px = --space-12)
 * - Added hover state for primary CTA button
 * - Improved grid gap for better visual separation
 * - Enhanced empty state with larger icon and better spacing
 *
 * Phase 6 CHANGES:
 * - Added TutorDashboardClient wrapper for wizard message
 * - Fetches onboardingCompleted status
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { transitionWeeklyCycles } from "@/lib/weekly-cycle";
import { Navigation } from "@/components/tutor/Navigation";
import { LearnerCard } from "@/components/tutor/LearnerCard";
import { TutorDashboardClient } from "@/components/tutor/TutorDashboardClient";
import Link from "next/link";
import styles from "./page.module.css";

// Type for tutor with nested learners and cycles
type TutorWithLearners = {
  id: string;
  fullName: string;
  email: string;
  onboardingCompleted: boolean;
  learners: {
    id: string;
    displayName: string;
    totalPoints: number;
    weeklyCycles: {
      id: string;
      status: "DRAFT" | "ACTIVE" | "REVIEW" | "COMPLETED";
      tasks: {
        id: string;
        frequencyPerWeek: number;
        pointValue: number;
        completions: {
          id: string;
          pointsAwarded: number;
          tutorApproved: boolean | null;
        }[];
      }[];
    }[];
  }[];
};

export default async function TutorDashboardPage() {
  const session = await auth();

  // Redirect if not authenticated or not a tutor
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  // Phase 5.1: Transition expired ACTIVE cycles to REVIEW status
  // Called on dashboard load (temporary for MVP, later move to cron job)
  await transitionWeeklyCycles();

  // Fetch tutor with learners
  const tutorQuery = await prisma.tutor.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      onboardingCompleted: true,
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
                      tutorApproved: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }) as TutorWithLearners | null;

  if (!tutorQuery) {
    redirect("/tutor/login");
  }

  const tutor = tutorQuery;

  // Transform learner data for cards
  const learners = tutor.learners.map((learner) => {
    const currentCycle = learner.weeklyCycles[0];

    if (!currentCycle) {
      return {
        id: learner.id,
        displayName: learner.displayName,
        totalPoints: learner.totalPoints,
        currentCycle: null,
        pendingCompletions: 0,
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

    // Count pending completions (tutorApproved === null)
    const pendingCompletions = currentCycle.tasks.reduce(
      (sum, task) =>
        sum + task.completions.filter((c) => c.tutorApproved === null).length,
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
      pendingCompletions,
    };
  });

  const hasLearners = learners.length > 0;
  const canAddMore = learners.length < 4;

  // Phase 6: Show welcome wizard if onboarding not completed
  const showWelcome = !tutor.onboardingCompleted;

  return (
    <TutorDashboardClient showWelcome={showWelcome}>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-mist-50)" }}
      >
        {/* Navigation */}
        <Navigation tutorName={tutor.fullName} />

        {/* Main Content - Enhanced spacing */}
        <main
        className="max-w-7xl mx-auto"
        style={{
          padding: "var(--space-10) var(--space-6)",
        }}
      >
        {/* Header - Increased bottom spacing */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h1)",
              lineHeight: "var(--line-height-h1)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-3)",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-grey-600)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Manage your learners and their weekly tasks
          </p>
        </div>

        {/* Add Learner Button - Enhanced with hover and proper sizing */}
        {canAddMore && (
          <div style={{ marginBottom: "var(--space-8)" }}>
            <Link
              href="/tutor/learners/add"
              className={styles.addLearnerButton}
              style={{
                backgroundColor: "var(--color-peach-500)",
                color: "white",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                boxShadow: "var(--shadow-sm)",
                padding: "var(--space-3) var(--space-6)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                height: "var(--space-12)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              + Add Learner
            </Link>
          </div>
        )}

        {/* Learners Grid - Enhanced gap for better visual separation */}
        {hasLearners ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: "var(--space-8)" }}
          >
            {learners.map((learner) => (
              <LearnerCard key={learner.id} learner={learner} />
            ))}
          </div>
        ) : (
          /* Empty State - Enhanced with better spacing and larger icon */
          <div
            className="text-center"
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-16)",
            }}
          >
            {/* Larger icon container for better visibility */}
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "var(--color-mist-100)",
                borderRadius: "var(--radius-pill)",
                fontSize: "56px",
                marginBottom: "var(--space-6)",
              }}
            >
              👥
            </div>
            <h3
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
                fontFamily: "var(--font-family-body)",
                marginBottom: "var(--space-3)",
              }}
            >
              No learners yet
            </h3>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-family-body)",
                marginBottom: "var(--space-8)",
              }}
            >
              Add your first learner to get started with Board Master
            </p>
            <Link
              href="/tutor/learners/add"
              className={styles.emptyStateButton}
              style={{
                backgroundColor: "var(--color-navy-500)",
                color: "white",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                padding: "var(--space-3) var(--space-6)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                height: "var(--space-12)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Add Your First Learner
            </Link>
          </div>
        )}
        </main>
      </div>
    </TutorDashboardClient>
  );
}
