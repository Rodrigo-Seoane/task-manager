"use client";

/**
 * Weekly Task List Component
 * Displays tasks with edit/delete actions
 * Phase 3.1 - Task Creation UI
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================

interface Task {
  id: string;
  title: string;
  description: string | null;
  iconName: string | null;
  pointValue: number;
  frequencyPerWeek: number;
  isBossTask: boolean;
  expectation: string | null;
}

interface WeeklyTaskListProps {
  tasks: Task[];
  isLocked: boolean;
}

// ============================================================================
// ICON MAPPING (Match IconPicker)
// ============================================================================

const ICON_EMOJI_MAP: Record<string, string> = {
  toothbrush: "🪥",
  bed: "🛏️",
  book: "📖",
  backpack: "🎒",
  apple: "🍎",
  shower: "🚿",
  clothes: "👕",
  dishes: "🍽️",
  broom: "🧹",
  homework: "✏️",
  music: "🎵",
  sports: "⚽",
  plant: "🪴",
  pet: "🐕",
  trash: "🗑️",
  cooking: "🍳",
  laundry: "🧺",
  star: "⭐",
  bike: "🚲",
  art: "🎨",
  game: "🎮",
  movie: "🎬",
  pizza: "🍕",
  "ice-cream": "🍦",
  park: "🏞️",
  trophy: "🏆",
  gift: "🎁",
  party: "🎉",
};

// ============================================================================
// COMPONENT
// ============================================================================

export function WeeklyTaskList({ tasks, isLocked }: WeeklyTaskListProps) {
  const router = useRouter();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setDeletingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.error || "Failed to delete task");
        setDeletingTaskId(null);
        return;
      }

      // Success - refresh page
      router.refresh();
    } catch (error) {
      console.error("[DELETE_TASK_ERROR]", error);
      alert("An unexpected error occurred. Please try again.");
      setDeletingTaskId(null);
    }
  };

  // Separate regular tasks and boss tasks
  const regularTasks = tasks.filter((task) => !task.isBossTask);
  const bossTasks = tasks.filter((task) => task.isBossTask);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Regular Tasks */}
      {regularTasks.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-h5)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-4)",
            }}
          >
            Regular Tasks ({regularTasks.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {regularTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isLocked={isLocked}
                isDeleting={deletingTaskId === task.id}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boss Tasks */}
      {bossTasks.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "var(--font-size-h5)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-peach-700)",
              marginBottom: "var(--space-4)",
            }}
          >
            🏆 Boss Tasks ({bossTasks.length}/2)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {bossTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isLocked={isLocked}
                isDeleting={deletingTaskId === task.id}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TASK CARD SUB-COMPONENT
// ============================================================================

interface TaskCardProps {
  task: Task;
  isLocked: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

function TaskCard({ task, isLocked, isDeleting, onDelete }: TaskCardProps) {
  const emoji = task.iconName ? ICON_EMOJI_MAP[task.iconName] : null;

  return (
    <div
      style={{
        backgroundColor: task.isBossTask
          ? "var(--color-peach-50)"
          : "white",
        border: `2px solid ${
          task.isBossTask ? "var(--color-peach-200)" : "var(--color-grey-200)"
        }`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-4)",
      }}
    >
      {/* Icon */}
      {emoji && (
        <div
          style={{
            fontSize: "32px",
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <h4
          style={{
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-2)",
          }}
        >
          {task.title}
        </h4>

        {/* Metadata */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            marginBottom: task.expectation ? "var(--space-2)" : 0,
          }}
        >
          <span
            style={{
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
            }}
          >
            {task.frequencyPerWeek}× per week
          </span>
          <span
            style={{
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
            }}
          >
            •
          </span>
          <span
            style={{
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
            }}
          >
            {task.pointValue} points each
          </span>
          {task.isBossTask && (
            <>
              <span
                style={{
                  fontSize: "var(--font-size-small)",
                  fontFamily: "var(--font-family-body)",
                  color: "var(--color-grey-600)",
                }}
              >
                •
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-small)",
                  fontFamily: "var(--font-family-body)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-peach-600)",
                }}
              >
                Boss Task
              </span>
            </>
          )}
        </div>

        {/* Expectation */}
        {task.expectation && (
          <p
            style={{
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Done when: {task.expectation}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isLocked && (
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onDelete}
            disabled={isDeleting}
            style={{
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: "var(--color-error-100)",
              color: "var(--color-error-400)",
              border: "1px solid var(--color-error-300)",
              borderRadius: "var(--radius-md)",
              cursor: isDeleting ? "not-allowed" : "pointer",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-error-200)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-error-100)";
              }
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
