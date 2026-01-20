/**
 * Learner Selection Page
 * Route: /learner/select
 * Phase 4.1 - Learner Login
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LearnerSelectionClient } from "@/components/learner/LearnerSelectionClient";

export default async function LearnerSelectPage() {
  const session = await auth();

  // Must be logged in as tutor to see learner selection
  // This ensures only the family can access the learner selection
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  const tutorId = session.user.id;

  // Fetch all learners for this tutor
  const learners = await prisma.learner.findMany({
    where: {
      tutorId,
    },
    select: {
      id: true,
      displayName: true,
    },
    orderBy: {
      displayName: "asc",
    },
  });

  if (learners.length === 0) {
    redirect("/tutor/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-mist-50)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
      }}
    >
      {/* App Logo / Title */}
      <h1
        style={{
          fontSize: "var(--font-size-display)",
          fontFamily: "var(--font-family-display)",
          color: "var(--color-navy-800)",
          marginBottom: "var(--space-2)",
          textAlign: "center",
        }}
      >
        Board Master
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "var(--font-size-h3)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          marginBottom: "var(--space-12)",
          textAlign: "center",
        }}
      >
        Who&apos;s playing today?
      </p>

      {/* Learner Selection Grid */}
      <LearnerSelectionClient learners={learners} />

      {/* Help Button */}
      <button
        style={{
          marginTop: "var(--space-12)",
          padding: "var(--space-4) var(--space-8)",
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-medium)",
          backgroundColor: "transparent",
          color: "var(--color-grey-500)",
          border: "1px solid var(--color-grey-300)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
        }}
      >
        Ask Tutor for Help
      </button>
    </div>
  );
}
