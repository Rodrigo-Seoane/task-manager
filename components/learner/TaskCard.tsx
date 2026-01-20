"use client";

/**
 * Task Card Component
 * Phase 4.2 - Learner Dashboard
 * 60px icons, frequency dots, child-friendly design
 */

import { TASK_ICONS } from "@/lib/taskIcons";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    iconName: string | null;
    frequencyPerWeek: number;
    expectation: string | null;
  };
  completionsThisWeek: number;
  onComplete: () => void;
  disabled?: boolean;
}

export function TaskCard({
  task,
  completionsThisWeek,
  onComplete,
  disabled = false,
}: TaskCardProps) {
  const isFullyCompleted = completionsThisWeek >= task.frequencyPerWeek;
  const icon = task.iconName ? TASK_ICONS[task.iconName] || "📋" : "📋";

  // Generate frequency dots
  const renderFrequencyDots = () => {
    const dots = [];
    for (let i = 0; i < task.frequencyPerWeek; i++) {
      const isCompleted = i < completionsThisWeek;
      dots.push(
        <span
          key={i}
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: isCompleted
              ? "var(--color-success-300)"
              : "var(--color-grey-300)",
            marginRight: i < task.frequencyPerWeek - 1 ? "6px" : "0",
            transition: "all var(--transition-fast)",
          }}
        />
      );
    }
    return dots;
  };

  return (
    <button
      onClick={() => !disabled && !isFullyCompleted && onComplete()}
      disabled={disabled || isFullyCompleted}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        backgroundColor: isFullyCompleted
          ? "var(--color-success-100)"
          : "white",
        border: isFullyCompleted
          ? "2px solid var(--color-success-300)"
          : "2px solid var(--color-grey-200)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        cursor: disabled || isFullyCompleted ? "default" : "pointer",
        transition: "all var(--transition-fast)",
        textAlign: "left",
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isFullyCompleted) {
          e.currentTarget.style.borderColor = "var(--color-navy-500)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isFullyCompleted) {
          e.currentTarget.style.borderColor = "var(--color-grey-200)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {/* Task Icon */}
      <div
        style={{
          width: "60px",
          height: "60px",
          minWidth: "60px",
          borderRadius: "var(--radius-md)",
          backgroundColor: isFullyCompleted
            ? "var(--color-success-200)"
            : "var(--color-grey-100)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        {isFullyCompleted ? "✓" : icon}
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
        {/* Task Title */}
        <span
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: isFullyCompleted
              ? "var(--color-success-400)"
              : "var(--color-navy-800)",
            textDecoration: isFullyCompleted ? "line-through" : "none",
          }}
        >
          {task.title}
        </span>

        {/* Frequency Dots */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderFrequencyDots()}
        </div>
      </div>

      {/* Completion Indicator */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: isFullyCompleted
            ? "var(--color-success-300)"
            : "var(--color-grey-200)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          color: isFullyCompleted ? "white" : "var(--color-grey-400)",
        }}
      >
        {isFullyCompleted ? "✓" : "○"}
      </div>
    </button>
  );
}
