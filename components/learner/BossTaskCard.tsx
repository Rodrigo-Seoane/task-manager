"use client";

/**
 * Boss Task Card Component
 * Phase 4.4 - Boss Task Completion
 * Golden border, trophy icon, locked state
 */

import { TASK_ICONS } from "@/lib/taskIcons";

interface BossTaskCardProps {
  task: {
    id: string;
    title: string;
    iconName: string | null;
    frequencyPerWeek: number;
    expectation: string | null;
  };
  completionsThisWeek: number;
  isUnlocked: boolean;
  tasksToUnlock: number;
  onComplete: () => void;
  onLockedClick: () => void;
  disabled?: boolean;
}

export function BossTaskCard({
  task,
  completionsThisWeek,
  isUnlocked,
  tasksToUnlock,
  onComplete,
  onLockedClick,
  disabled = false,
}: BossTaskCardProps) {
  const isCompleted = completionsThisWeek >= task.frequencyPerWeek;
  const icon = task.iconName ? TASK_ICONS[task.iconName] || "🏆" : "🏆";

  const handleClick = () => {
    if (disabled) return;

    if (!isUnlocked) {
      onLockedClick();
      return;
    }

    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isCompleted}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-5)",
        backgroundColor: isCompleted
          ? "var(--color-peach-100)"
          : isUnlocked
          ? "white"
          : "var(--color-grey-100)",
        border: isCompleted
          ? "3px solid var(--color-peach-500)"
          : isUnlocked
          ? "3px solid #FFD700"
          : "3px solid var(--color-grey-300)",
        borderRadius: "var(--radius-lg)",
        boxShadow: isUnlocked ? "0 4px 12px rgba(255, 215, 0, 0.3)" : "var(--shadow-sm)",
        cursor: disabled || isCompleted ? "default" : "pointer",
        transition: "all var(--transition-fast)",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isCompleted) {
          if (isUnlocked) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 215, 0, 0.4)";
          } else {
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isCompleted) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isUnlocked
            ? "0 4px 12px rgba(255, 215, 0, 0.3)"
            : "var(--shadow-sm)";
        }
      }}
    >
      {/* Locked Overlay */}
      {!isUnlocked && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <span style={{ fontSize: "32px" }}>🔒</span>
            <span
              style={{
                fontSize: "var(--font-size-small)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "white",
                textAlign: "center",
                padding: "0 var(--space-4)",
              }}
            >
              Complete {tasksToUnlock} more task{tasksToUnlock !== 1 ? "s" : ""} to
              unlock!
            </span>
          </div>
        </div>
      )}

      {/* Trophy Badge */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          width: "40px",
          height: "40px",
          backgroundColor: isCompleted
            ? "var(--color-peach-500)"
            : "#FFD700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
          opacity: isUnlocked ? 1 : 0.5,
        }}
      >
        🏆
      </div>

      {/* Task Icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          minWidth: "72px",
          borderRadius: "var(--radius-md)",
          backgroundColor: isCompleted
            ? "var(--color-peach-200)"
            : isUnlocked
            ? "rgba(255, 215, 0, 0.2)"
            : "var(--color-grey-200)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
        }}
      >
        {isCompleted ? "✓" : icon}
      </div>

      {/* Task Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {/* Boss Task Label */}
        <span
          style={{
            fontSize: "var(--font-size-caption)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: isCompleted
              ? "var(--color-peach-600)"
              : isUnlocked
              ? "#B8860B"
              : "var(--color-grey-500)",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Boss Task
        </span>

        {/* Task Title */}
        <span
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: isCompleted
              ? "var(--color-peach-700)"
              : "var(--color-navy-800)",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>
      </div>

      {/* Completion Indicator */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: isCompleted
            ? "var(--color-peach-500)"
            : isUnlocked
            ? "#FFD700"
            : "var(--color-grey-300)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "white",
        }}
      >
        {isCompleted ? "✓" : "○"}
      </div>
    </button>
  );
}
