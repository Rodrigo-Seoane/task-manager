"use client";

/**
 * Learner Card Component
 * Displays learner information on tutor dashboard
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-6, --space-4, --space-3)
 * - Used explicit radius tokens (--radius-lg for card, --radius-pill for badges/icon)
 * - Increased icon size for better visibility (56px, child-friendly)
 * - Improved spacing rhythm for better hierarchy
 * - Enhanced button with hover states
 * - Better status badge styling with explicit tokens
 */

import Link from "next/link";

interface LearnerCardProps {
  learner: {
    id: string;
    displayName: string;
    totalPoints: number;
    currentCycle?: {
      status: "DRAFT" | "ACTIVE" | "REVIEW" | "COMPLETED";
      tasksCompleted: number;
      totalTasks: number;
      pointsThisWeek: number;
    } | null;
  };
}

export function LearnerCard({ learner }: LearnerCardProps) {
  const statusLabels = {
    DRAFT: "Setting Up",
    ACTIVE: "Active",
    REVIEW: "Review Ready",
    COMPLETED: "Completed",
  };

  const statusColors = {
    DRAFT: {
      bg: "var(--color-grey-100)",
      text: "var(--color-grey-600)",
      border: "var(--color-grey-300)",
    },
    ACTIVE: {
      bg: "var(--color-info-100)",
      text: "var(--color-info-400)",
      border: "var(--color-info-300)",
    },
    REVIEW: {
      bg: "var(--color-warning-100)",
      text: "var(--color-warning-400)",
      border: "var(--color-warning-300)",
    },
    COMPLETED: {
      bg: "var(--color-success-100)",
      text: "var(--color-success-400)",
      border: "var(--color-success-300)",
    },
  };

  const status = learner.currentCycle?.status || "DRAFT";
  const colors = statusColors[status];

  return (
    <div
      className="transition-all"
      style={{
        backgroundColor: "white",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-grey-200)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Learner Name and Icon - Enhanced spacing */}
      <div
        className="flex items-start justify-between"
        style={{ marginBottom: "var(--space-5)" }}
      >
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-h4)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-3)",
            }}
          >
            {learner.displayName}
          </h3>

          {/* Status Badge - Enhanced with explicit tokens */}
          <span
            className="inline-block"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            {statusLabels[status]}
          </span>
        </div>

        {/* Icon - Larger for better visibility */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "var(--color-peach-100)",
            color: "var(--color-peach-600)",
            borderRadius: "var(--radius-pill)",
            fontSize: "28px",
          }}
        >
          👤
        </div>
      </div>

      {/* Stats - Enhanced spacing */}
      {learner.currentCycle ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            marginBottom: "var(--space-5)",
          }}
        >
          <div className="flex justify-between items-center">
            <span
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              This Week
            </span>
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              {learner.currentCycle.tasksCompleted} of{" "}
              {learner.currentCycle.totalTasks} tasks
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Points
            </span>
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-peach-600)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              {learner.currentCycle.pointsThisWeek} pts
            </span>
          </div>
        </div>
      ) : (
        <div
          className="text-center"
          style={{
            fontSize: "var(--font-size-small)",
            color: "var(--color-grey-500)",
            fontFamily: "var(--font-family-body)",
            padding: "var(--space-4) 0",
            marginBottom: "var(--space-5)",
          }}
        >
          No active weekly cycle
        </div>
      )}

      {/* Actions - Enhanced button */}
      <div>
        <Link
          href={`/tutor/weekly-tasks/${learner.id}`}
          className="flex-1 text-center transition-colors"
          style={{
            backgroundColor: "var(--color-navy-500)",
            color: "white",
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            display: "block",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-navy-600)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
          }}
        >
          Manage Tasks
        </Link>
      </div>

      {/* Total Points - Enhanced spacing */}
      <div
        className="text-center"
        style={{
          borderTop: "1px solid var(--color-grey-200)",
          fontSize: "var(--font-size-caption)",
          color: "var(--color-grey-500)",
          fontFamily: "var(--font-family-body)",
          marginTop: "var(--space-5)",
          paddingTop: "var(--space-4)",
        }}
      >
        Total: {learner.totalPoints} lifetime points
      </div>
    </div>
  );
}
