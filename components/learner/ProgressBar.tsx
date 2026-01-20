"use client";

/**
 * Progress Bar Component
 * Phase 4.2 - Learner Dashboard
 * Color-coded states: red < 40%, yellow < 70%, green < 80%, gold >= 80%
 */

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const ratio = total > 0 ? completed / total : 0;
  const percentage = Math.round(ratio * 100);

  // Determine color based on ratio
  const getProgressColor = () => {
    if (ratio < 0.4) return "var(--color-error-300)"; // Red
    if (ratio < 0.7) return "var(--color-warning-300)"; // Yellow
    if (ratio < 0.8) return "var(--color-success-300)"; // Green
    return "#FFD700"; // Gold
  };

  // Get encouragement message based on progress
  const getMessage = () => {
    const remaining = total - completed;
    const tasksToUnlock = Math.ceil(total * 0.8) - completed;

    if (ratio < 0.4) {
      return `Keep going! ${remaining} tasks to go.`;
    }
    if (ratio < 0.7) {
      return `Great start! ${remaining} tasks to go.`;
    }
    if (ratio < 0.8) {
      return `Almost there! ${tasksToUnlock} more to unlock Boss Tasks!`;
    }
    return "Boss Tasks unlocked! Great work!";
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {/* Progress Text */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "var(--font-size-h2)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
          }}
        >
          {completed} of {total} tasks done!
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "24px",
          backgroundColor: "var(--color-grey-200)",
          borderRadius: "var(--radius-pill)",
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: getProgressColor(),
            borderRadius: "var(--radius-pill)",
            transition: "width 0.5s ease-out, background-color 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Encouragement Message */}
      <p
        style={{
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          margin: 0,
          textAlign: "center",
        }}
      >
        {getMessage()}
      </p>
    </div>
  );
}
