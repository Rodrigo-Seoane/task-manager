/**
 * Learner Card Component
 * Displays learner information on tutor dashboard
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
      className="rounded-lg p-6 transition-all hover:shadow-lg"
      style={{
        backgroundColor: "white",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      {/* Learner Name */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-h3)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-2)",
            }}
          >
            {learner.displayName}
          </h3>

          {/* Status Badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              fontSize: "var(--font-size-small)",
            }}
          >
            {statusLabels[status]}
          </span>
        </div>

        {/* Icon Placeholder */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "var(--color-peach-100)",
            color: "var(--color-peach-600)",
            fontSize: "24px",
          }}
        >
          👤
        </div>
      </div>

      {/* Stats */}
      {learner.currentCycle ? (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-grey-600)",
              }}
            >
              This Week
            </span>
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
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
              }}
            >
              Points
            </span>
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-peach-600)",
              }}
            >
              {learner.currentCycle.pointsThisWeek} pts
            </span>
          </div>
        </div>
      ) : (
        <div
          className="mb-4 text-center py-3"
          style={{
            fontSize: "var(--font-size-small)",
            color: "var(--color-grey-500)",
          }}
        >
          No active weekly cycle
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          href={`/tutor/learners/${learner.id}`}
          className="flex-1 text-center py-2 px-4 rounded-lg transition-colors"
          style={{
            backgroundColor: "var(--color-navy-500)",
            color: "white",
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          View Details
        </Link>
      </div>

      {/* Total Points */}
      <div
        className="mt-4 pt-4 text-center"
        style={{
          borderTop: "1px solid var(--color-grey-200)",
          fontSize: "var(--font-size-caption)",
          color: "var(--color-grey-500)",
        }}
      >
        Total: {learner.totalPoints} lifetime points
      </div>
    </div>
  );
}
