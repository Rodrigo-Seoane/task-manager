"use client";

/**
 * Week Review Client Component
 * Phase 4.2 - Shown when weekly_cycle.status = REVIEW
 */

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface WeekReviewClientProps {
  learnerName: string;
  tasksCompleted: number;
}

export function WeekReviewClient({
  learnerName,
  tasksCompleted,
}: WeekReviewClientProps) {
  const router = useRouter();

  const handleOkay = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/learner/login");
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
      // Force navigation even if signOut fails
      window.location.href = "/learner/login";
    }
  };

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
        textAlign: "center",
      }}
    >
      {/* Wizard Avatar */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "var(--color-navy-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          marginBottom: "var(--space-8)",
        }}
      >
        🧙
      </div>

      {/* Greeting */}
      <h1
        style={{
          fontSize: "var(--font-size-h2)",
          fontFamily: "var(--font-family-display)",
          color: "var(--color-navy-800)",
          marginBottom: "var(--space-4)",
        }}
      >
        Great job, {learnerName}!
      </h1>

      {/* Message */}
      <p
        style={{
          fontSize: "var(--font-size-h4)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          marginBottom: "var(--space-4)",
          maxWidth: "400px",
        }}
      >
        Your tutor is reviewing your week!
      </p>

      <p
        style={{
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-500)",
          marginBottom: "var(--space-8)",
          maxWidth: "400px",
        }}
      >
        Check back soon to see your final score.
      </p>

      {/* Illustration - Completed Tasks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-8)",
          padding: "var(--space-6)",
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            fontSize: "48px",
          }}
        >
          📋✅
        </div>
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            margin: 0,
          }}
        >
          {tasksCompleted} task{tasksCompleted !== 1 ? "s" : ""} completed!
        </p>
      </div>

      {/* Okay Button */}
      <button
        onClick={handleOkay}
        style={{
          padding: "var(--space-4) var(--space-10)",
          fontSize: "var(--font-size-h5)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-semibold)",
          backgroundColor: "var(--color-navy-500)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-lg)",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-navy-600)";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Okay
      </button>
    </div>
  );
}
