"use client";

/**
 * Locked Boss Task Modal Component
 * Phase 4.4 - Boss Task Completion
 * Info modal when tapping locked boss task
 */

interface LockedBossTaskModalProps {
  tasksToUnlock: number;
  completed: number;
  total: number;
  onDismiss: () => void;
}

export function LockedBossTaskModal({
  tasksToUnlock,
  completed,
  total,
  onDismiss,
}: LockedBossTaskModalProps) {
  // Calculate visual progress
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

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
        if (e.target === e.currentTarget) {
          onDismiss();
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
        {/* Lock Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto var(--space-6)",
            borderRadius: "50%",
            backgroundColor: "var(--color-grey-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
          }}
        >
          🔒
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "var(--font-size-h3)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-4)",
          }}
        >
          Boss Tasks Locked
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-600)",
            marginBottom: "var(--space-6)",
          }}
        >
          Complete{" "}
          <strong style={{ color: "var(--color-navy-800)" }}>
            {tasksToUnlock} more task{tasksToUnlock !== 1 ? "s" : ""}
          </strong>{" "}
          to unlock Boss Tasks!
        </p>

        {/* Visual Progress */}
        <div
          style={{
            marginBottom: "var(--space-6)",
            padding: "var(--space-4)",
            backgroundColor: "var(--color-grey-50)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
              marginBottom: "var(--space-3)",
            }}
          >
            {completed} of {total} tasks done
          </p>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "16px",
              backgroundColor: "var(--color-grey-200)",
              borderRadius: "var(--radius-pill)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor:
                  progressPercent < 40
                    ? "var(--color-error-300)"
                    : progressPercent < 70
                    ? "var(--color-warning-300)"
                    : "var(--color-success-300)",
                borderRadius: "var(--radius-pill)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Target Marker */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "var(--space-2)",
              paddingRight: "20%", // 80% mark
            }}
          >
            <span
              style={{
                fontSize: "var(--font-size-caption)",
                fontFamily: "var(--font-family-body)",
                color: "var(--color-grey-500)",
              }}
            >
              ↑ unlock at 80%
            </span>
          </div>
        </div>

        {/* Encouragement */}
        <p
          style={{
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-success-400)",
            marginBottom: "var(--space-6)",
          }}
        >
          You&apos;re almost there—keep going! 💪
        </p>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          style={{
            padding: "var(--space-4) var(--space-8)",
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
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
