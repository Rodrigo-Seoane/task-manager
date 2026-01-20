/**
 * Weekly Task Creation Page
 * Route: /tutor/weekly-tasks/[learnerId]
 * Phase 3.1 - Task Creation UI
 *
 * Allows tutors to create and manage weekly tasks for a learner
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/tutor/Navigation";
import { WeeklyTasksClient } from "@/components/tutor/WeeklyTasksClient";
import Link from "next/link";

// Type for learner with weekly cycles and tasks
type LearnerWithCyclesAndTasks = {
  id: string;
  displayName: string;
  weeklyCycles: {
    id: string;
    status: "DRAFT" | "ACTIVE" | "REVIEW" | "COMPLETED";
    startDate: Date;
    endDate: Date;
    tasks: {
      id: string;
      title: string;
      description: string | null;
      iconName: string | null;
      pointValue: number;
      frequencyPerWeek: number;
      isBossTask: boolean;
      expectation: string | null;
      createdAt: Date;
    }[];
  }[];
};

interface PageProps {
  params: Promise<{
    learnerId: string;
  }>;
}

export default async function WeeklyTasksPage({ params }: PageProps) {
  const session = await auth();

  // Redirect if not authenticated or not a tutor
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  const tutorId = session.user.id;
  const { learnerId } = await params;

  // Fetch learner and verify ownership
  const learnerQuery = await prisma.learner.findFirst({
    where: {
      id: learnerId,
      tutorId,
    },
    include: {
      weeklyCycles: {
        where: {
          status: {
            in: ["DRAFT", "ACTIVE"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          tasks: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  }) as LearnerWithCyclesAndTasks | null;

  if (!learnerQuery) {
    redirect("/tutor/dashboard");
  }

  const learner = learnerQuery;
  let currentCycle = learner.weeklyCycles?.[0] || null;

  // Create a new DRAFT cycle if none exists
  if (!currentCycle) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    const followingSunday = new Date(nextMonday);
    followingSunday.setDate(nextMonday.getDate() + 6);
    followingSunday.setHours(23, 59, 59, 999);

    currentCycle = await prisma.weeklyCycle.create({
      data: {
        learnerId: learner.id,
        startDate: nextMonday,
        endDate: followingSunday,
        status: "DRAFT",
      },
      include: {
        tasks: true,
      },
    });
  }

  const tasks = currentCycle?.tasks || [];
  const isLocked = currentCycle?.status === "ACTIVE";

  // Calculate task counts
  const bossTaskCount = tasks.filter((task) => task.isBossTask).length;
  const totalTaskCount = tasks.length;

  // Calculate total completions needed
  const totalCompletionsNeeded = tasks
    .filter((task) => !task.isBossTask)
    .reduce((sum: number, task: { frequencyPerWeek: number }) => sum + task.frequencyPerWeek, 0);

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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "var(--space-8)",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            marginBottom: "var(--space-8)",
          }}
        >
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
            Weekly Tasks for {learner.displayName}
          </h1>

          {currentCycle && (
            <p
              style={{
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-grey-600)",
              }}
            >
              Week of{" "}
              {new Date(currentCycle.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              –{" "}
              {new Date(currentCycle.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Locked Banner */}
        {isLocked && (
          <div
            style={{
              backgroundColor: "var(--color-warning-100)",
              border: "1px solid var(--color-warning-300)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <p
              style={{
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-warning-400)",
                fontWeight: "var(--font-weight-semibold)",
                margin: 0,
              }}
            >
              ⚠️ Tasks are locked for this week. You can edit next week&apos;s tasks
              or end this week early.
            </p>
          </div>
        )}

        {/* Task Counter Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {/* Total Tasks */}
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-small)",
                  fontFamily: "var(--font-family-body)",
                  color: "var(--color-grey-500)",
                  marginBottom: "var(--space-1)",
                }}
              >
                Total Tasks
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-h2)",
                  fontFamily: "var(--font-family-body)",
                  fontWeight: "var(--font-weight-semibold)",
                  color:
                    totalTaskCount >= 12
                      ? "var(--color-error-400)"
                      : "var(--color-navy-800)",
                  margin: 0,
                }}
              >
                {totalTaskCount} / 12
              </p>
            </div>

            {/* Boss Tasks */}
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-small)",
                  fontFamily: "var(--font-family-body)",
                  color: "var(--color-grey-500)",
                  marginBottom: "var(--space-1)",
                }}
              >
                Boss Tasks
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-h2)",
                  fontFamily: "var(--font-family-body)",
                  fontWeight: "var(--font-weight-semibold)",
                  color:
                    bossTaskCount >= 2
                      ? "var(--color-error-400)"
                      : "var(--color-peach-600)",
                  margin: 0,
                }}
              >
                {bossTaskCount} / 2
              </p>
            </div>

            {/* Total Completions */}
            <div>
              <p
                style={{
                  fontSize: "var(--font-size-small)",
                  fontFamily: "var(--font-family-body)",
                  color: "var(--color-grey-500)",
                  marginBottom: "var(--space-1)",
                }}
              >
                Total Completions Needed
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-h2)",
                  fontFamily: "var(--font-family-body)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-navy-800)",
                  margin: 0,
                }}
              >
                {totalCompletionsNeeded}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <WeeklyTasksClient
          weeklyCycleId={currentCycle?.id || null}
          tasks={tasks}
          isLocked={isLocked}
          totalTaskCount={totalTaskCount}
          learnerId={learnerId}
        />
      </main>
    </div>
  );
}
