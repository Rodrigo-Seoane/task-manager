"use client";

/**
 * Task Completion Modal Component
 * Phase 4.3 - Task Completion
 * Child-friendly confirmation dialog
 */

import { TASK_ICONS } from "@/lib/taskIcons";

interface TaskCompletionModalProps {
  task: {
    id: string;
    title: string;
    iconName: string | null;
    expectation: string | null;
    isBossTask: boolean;
  };
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function TaskCompletionModal({
  task,
  onConfirm,
  onCancel,
  isLoading = false,
  error = null,
}: TaskCompletionModalProps) {
  const icon = task.iconName
    ? TASK_ICONS[task.iconName] || (task.isBossTask ? "🏆" : "📋")
    : task.isBossTask
    ? "🏆"
    : "📋";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onCancel();
        }
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-8)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Task Icon */}
        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto var(--space-6)",
            borderRadius: "50%",
            backgroundColor: task.isBossTask
              ? "rgba(255, 215, 0, 0.2)"
              : "var(--color-mist-100)",
            border: task.isBossTask ? "3px solid #FFD700" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
          }}
        >
          {icon}
        </div>

        {/* Task Title */}
        <h2
          style={{
            fontSize: "var(--font-size-h3)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-4)",
          }}
        >
          {task.title}
        </h2>

        {/* Expectation (if set) */}
        {task.expectation && (
          <div
            style={{
              backgroundColor: "var(--color-mist-50)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <p
              style={{
                fontSize: "var(--font-size-small)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--color-grey-600)",
                marginBottom: "var(--space-2)",
              }}
            >
              Remember:
            </p>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-navy-800)",
                margin: 0,
              }}
            >
              {task.expectation}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "var(--color-error-100)",
              border: "1px solid var(--color-error-300)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <p
              style={{
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-error-400)",
                margin: 0,
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Confirmation Question */}
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-600)",
            marginBottom: "var(--space-8)",
          }}
        >
          Did you complete this task?
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            justifyContent: "center",
          }}
        >
          {/* Not Yet Button */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              height: "60px",
              fontSize: "var(--font-size-h5)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor: "var(--color-grey-100)",
              color: "var(--color-grey-600)",
              border: "2px solid var(--color-grey-300)",
              borderRadius: "var(--radius-lg)",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all var(--transition-fast)",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--color-grey-200)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
              }
            }}
          >
            Not yet
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              height: "60px",
              fontSize: "var(--font-size-h5)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor: task.isBossTask
                ? "#FFD700"
                : "var(--color-success-300)",
              color: task.isBossTask ? "var(--color-grey-800)" : "white",
              border: "none",
              borderRadius: "var(--radius-lg)",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all var(--transition-fast)",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {isLoading ? "..." : "Yes, I did it!"}
          </button>
        </div>
      </div>
    </div>
  );
}
