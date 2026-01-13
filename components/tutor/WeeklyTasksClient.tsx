"use client";

/**
 * Weekly Tasks Client Component
 * Client wrapper for task management with modal
 * Phase 3.1 - Task Creation UI
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WeeklyTaskList } from "./WeeklyTaskList";

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

interface WeeklyTasksClientProps {
  weeklyCycleId: string | null;
  tasks: Task[];
  isLocked: boolean;
  totalTaskCount: number;
  learnerId: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function WeeklyTasksClient({
  weeklyCycleId,
  tasks,
  isLocked,
  totalTaskCount,
  learnerId,
}: WeeklyTasksClientProps) {
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(false);

  const canAddTasks = !isLocked && weeklyCycleId && totalTaskCount < 12;

  const handleActivateWeek = async () => {
    if (!weeklyCycleId) return;

    if (tasks.length === 0) {
      alert("Please add at least one task before activating the week.");
      return;
    }

    if (!confirm("Activate this week? Tasks will be locked and learner can start completing them.")) {
      return;
    }

    setIsActivating(true);

    try {
      const response = await fetch(`/api/weekly-cycles/${weeklyCycleId}/activate`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to activate week");
        setIsActivating(false);
        return;
      }

      // Success - refresh page
      router.refresh();
    } catch (error) {
      console.error("[ACTIVATE_WEEK_ERROR]", error);
      alert("An unexpected error occurred. Please try again.");
      setIsActivating(false);
    }
  };

  return (
    <div>
      {/* Action Buttons */}
      {!isLocked && weeklyCycleId && (
        <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <button
            onClick={() => router.push(`/tutor/weekly-tasks/${learnerId}/add-task`)}
            disabled={totalTaskCount >= 12}
            style={{
              padding: "var(--space-3) var(--space-6)",
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor:
                totalTaskCount >= 12
                  ? "var(--color-grey-300)"
                  : "var(--color-navy-500)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              height: "var(--space-12)",
              cursor: totalTaskCount >= 12 ? "not-allowed" : "pointer",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              if (totalTaskCount < 12) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-navy-600)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={(e) => {
              if (totalTaskCount < 12) {
                e.currentTarget.style.backgroundColor =
                  "var(--color-navy-500)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {totalTaskCount >= 12 ? "Maximum Tasks Reached" : "+ Add Task"}
          </button>

          {tasks.length > 0 && (
            <button
              onClick={handleActivateWeek}
              disabled={isActivating}
              style={{
                padding: "var(--space-3) var(--space-6)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                backgroundColor: isActivating
                  ? "var(--color-peach-300)"
                  : "var(--color-peach-500)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                height: "var(--space-12)",
                cursor: isActivating ? "not-allowed" : "pointer",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (!isActivating) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-peach-600)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivating) {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-peach-500)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isActivating ? "Activating..." : "Activate Week"}
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <WeeklyTaskList tasks={tasks} isLocked={isLocked} />
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-16)",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-h4)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
              marginBottom: "var(--space-4)",
            }}
          >
            No tasks yet. Start by adding your first task!
          </p>
          {canAddTasks && (
            <button
              onClick={() => router.push(`/tutor/weekly-tasks/${learnerId}/add-task`)}
              style={{
                padding: "var(--space-3) var(--space-6)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-semibold)",
                backgroundColor: "var(--color-navy-500)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                height: "var(--space-12)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-navy-600)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-navy-500)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              + Add Your First Task
            </button>
          )}
        </div>
      )}
    </div>
  );
}
