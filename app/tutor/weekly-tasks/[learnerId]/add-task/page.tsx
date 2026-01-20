/**
 * Add Task Page
 * Route: /tutor/weekly-tasks/[learnerId]/add-task
 * Phase 3.1 - Task Creation UI (Separate Page)
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navigation } from "@/components/tutor/Navigation";
import { AddTaskClient } from "@/components/tutor/AddTaskClient";
import Link from "next/link";

// Type for learner with weekly cycles
type LearnerWithCycles = {
  id: string;
  displayName: string;
  weeklyCycles: {
    id: string;
    status: "DRAFT" | "ACTIVE" | "REVIEW" | "COMPLETED";
  }[];
};

interface PageProps {
  params: Promise<{
    learnerId: string;
  }>;
}

export default async function AddTaskPage({ params }: PageProps) {
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
      },
    },
  }) as LearnerWithCycles | null;

  if (!learnerQuery) {
    redirect("/tutor/dashboard");
  }

  const learner = learnerQuery;
  const currentCycle = learner.weeklyCycles?.[0] || null;

  // Redirect if no cycle or cycle is locked
  if (!currentCycle) {
    redirect(`/tutor/weekly-tasks/${learnerId}`);
  }

  if (currentCycle.status === "ACTIVE") {
    redirect(`/tutor/weekly-tasks/${learnerId}`);
  }

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
        <div
          style={{
            marginBottom: "var(--space-6)",
          }}
        >
          <Link
            href={`/tutor/weekly-tasks/${learnerId}`}
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
            ← Back to Weekly Tasks
          </Link>

          <h1
            style={{
              fontSize: "var(--font-size-h2)",
              fontFamily: "var(--font-family-display)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-2)",
            }}
          >
            Add New Task for {learner.displayName}
          </h1>

          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
            }}
          >
            Create a new task for the weekly cycle
          </p>
        </div>

        {/* Task Form Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <AddTaskClient
            weeklyCycleId={currentCycle.id}
            learnerId={learnerId}
          />
        </div>
      </main>
    </div>
  );
}
