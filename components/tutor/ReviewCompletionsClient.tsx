"use client";

/**
 * Review Completions Client Component
 * Displays pending task completions for tutor approval
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TASK_ICONS } from "@/lib/taskIcons";

interface Completion {
  id: string;
  taskId: string;
  taskTitle: string;
  taskIcon: string | null;
  isBossTask: boolean;
  pointsAwarded: number;
  completedAt: Date;
}

interface ReviewCompletionsClientProps {
  completions: Completion[];
  learnerName: string;
}

export function ReviewCompletionsClient({
  completions: initialCompletions,
  learnerName,
}: ReviewCompletionsClientProps) {
  const router = useRouter();
  const [completions, setCompletions] = useState(initialCompletions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApproval = async (completionId: string, approved: boolean) => {
    setLoadingId(completionId);

    try {
      const response = await fetch(`/api/completions/${completionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error(data.error);
        return;
      }

      // Remove the completion from the list
      setCompletions((prev) => prev.filter((c) => c.id !== completionId));

      // Refresh to update any server-rendered data
      router.refresh();
    } catch (error) {
      console.error("[APPROVAL_ERROR]", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleApproveAll = async () => {
    setLoadingId("all");

    try {
      // Approve all completions sequentially
      for (const completion of completions) {
        await fetch(`/api/completions/${completion.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: true }),
        });
      }

      // Clear all completions
      setCompletions([]);
      router.refresh();
    } catch (error) {
      console.error("[APPROVE_ALL_ERROR]", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (completions.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-12)",
          textAlign: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "var(--space-4)" }}>
          ✅
        </div>
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-600)",
          }}
        >
          All done! {learnerName}&apos;s tasks have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Approve All Button */}
      {completions.length > 1 && (
        <div style={{ marginBottom: "var(--space-6)" }}>
          <button
            onClick={handleApproveAll}
            disabled={loadingId !== null}
            style={{
              width: "100%",
              padding: "var(--space-4)",
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor: "var(--color-success-300)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: loadingId ? "not-allowed" : "pointer",
              opacity: loadingId ? 0.6 : 1,
              transition: "all var(--transition-fast)",
            }}
          >
            {loadingId === "all" ? "Approving..." : `✓ Approve All (${completions.length})`}
          </button>
        </div>
      )}

      {/* Completions List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {completions.map((completion) => {
          const icon = completion.taskIcon
            ? TASK_ICONS[completion.taskIcon] || "📋"
            : completion.isBossTask
            ? "🏆"
            : "📋";

          const isLoading = loadingId === completion.id || loadingId === "all";

          return (
            <div
              key={completion.id}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5)",
                boxShadow: "var(--shadow-sm)",
                border: completion.isBossTask
                  ? "2px solid #FFD700"
                  : "1px solid var(--color-grey-200)",
                opacity: isLoading ? 0.6 : 1,
                transition: "all var(--transition-fast)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                }}
              >
                {/* Task Icon */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: completion.isBossTask
                      ? "rgba(255, 215, 0, 0.2)"
                      : "var(--color-mist-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>

                {/* Task Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "var(--font-size-h5)",
                      fontFamily: "var(--font-family-body)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--color-navy-800)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    {completion.taskTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      fontFamily: "var(--font-family-body)",
                      color: "var(--color-grey-500)",
                    }}
                  >
                    Completed{" "}
                    {new Date(completion.completedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {completion.pointsAwarded > 0 && (
                    <p
                      style={{
                        fontSize: "var(--font-size-small)",
                        fontFamily: "var(--font-family-body)",
                        color: "var(--color-success-400)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      +{completion.pointsAwarded} points
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => handleApproval(completion.id, false)}
                    disabled={isLoading}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-grey-100)",
                      border: "1px solid var(--color-grey-300)",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all var(--transition-fast)",
                    }}
                    title="Reject"
                  >
                    ✗
                  </button>
                  <button
                    onClick={() => handleApproval(completion.id, true)}
                    disabled={isLoading}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--color-success-300)",
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontSize: "20px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all var(--transition-fast)",
                    }}
                    title="Approve"
                  >
                    ✓
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
