"use client";

/**
 * Learner Dashboard Client Component
 * Phase 4.2 - Learner Dashboard Core
 * Integrates all learner components with state management
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ProgressBar } from "./ProgressBar";
import { TaskCard } from "./TaskCard";
import { BossTaskCard } from "./BossTaskCard";
import { TaskCompletionModal } from "./TaskCompletionModal";
import { CompletionAnimation } from "./CompletionAnimation";
import { BossUnlockCelebration } from "./BossUnlockCelebration";
import { LockedBossTaskModal } from "./LockedBossTaskModal";

interface Task {
  id: string;
  title: string;
  iconName: string | null;
  frequencyPerWeek: number;
  expectation: string | null;
  isBossTask: boolean;
}

interface LearnerDashboardClientProps {
  learner: {
    id: string;
    displayName: string;
    totalPoints: number;
  };
  regularTasks: Task[];
  bossTasks: Task[];
  completionsByTask: Record<string, number>;
  progress: {
    completed: number;
    total: number;
    bossUnlocked: boolean;
    tasksToUnlock: number;
  };
}

export function LearnerDashboardClient({
  learner,
  regularTasks,
  bossTasks,
  completionsByTask: initialCompletions,
  progress: initialProgress,
}: LearnerDashboardClientProps) {
  const router = useRouter();
  const [completionsByTask, setCompletionsByTask] = useState(initialCompletions);
  const [progress, setProgress] = useState(initialProgress);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationIsBoss, setAnimationIsBoss] = useState(false);
  const [showBossUnlock, setShowBossUnlock] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [logoutHoldTimer, setLogoutHoldTimer] = useState<ReturnType<typeof setInterval> | null>(
    null
  );
  const [logoutProgress, setLogoutProgress] = useState(0);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setCompletionError(null); // Clear any previous error when opening modal
  };

  const handleLockedBossClick = () => {
    setShowLockedModal(true);
  };

  const handleConfirmCompletion = async () => {
    if (!selectedTask) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTask.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message in modal
        setCompletionError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      // Update local state
      setCompletionsByTask((prev) => ({
        ...prev,
        [selectedTask.id]: (prev[selectedTask.id] || 0) + 1,
      }));

      // Update progress from response
      if (data.progress) {
        const wasPreviouslyLocked = !progress.bossUnlocked;
        const isNowUnlocked = data.progress.bossUnlocked;

        setProgress({
          completed: data.progress.completed,
          total: data.progress.total,
          bossUnlocked: data.progress.bossUnlocked,
          tasksToUnlock: Math.max(
            0,
            Math.ceil(data.progress.total * 0.8) - data.progress.completed
          ),
        });

        // Check if boss tasks just got unlocked
        if (wasPreviouslyLocked && isNowUnlocked) {
          // Show boss unlock celebration first
          setSelectedTask(null);
          setShowBossUnlock(true);
          setIsLoading(false);
          return;
        }
      }

      // Show completion animation
      setAnimationIsBoss(selectedTask.isBossTask);
      setShowAnimation(true);
      setSelectedTask(null);
    } catch (error) {
      console.error("[COMPLETION_ERROR]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    router.refresh();
  }, [router]);

  const handleBossUnlockDismiss = useCallback(() => {
    setShowBossUnlock(false);
    router.refresh();
  }, [router]);

  // Perform actual logout
  const performLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push("/learner/login");
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
      // Force navigation even if signOut fails
      window.location.href = "/learner/login";
    }
  }, [router]);

  // Tap-and-hold logout (3 seconds)
  const handleLogoutStart = () => {
    setLogoutProgress(0);
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      setLogoutProgress(progressPercent);

      if (elapsed >= duration) {
        clearInterval(interval);
        setLogoutHoldTimer(null);
        performLogout();
      }
    }, 50);

    setLogoutHoldTimer(interval);
  };

  const handleLogoutEnd = () => {
    if (logoutHoldTimer) {
      clearInterval(logoutHoldTimer);
      setLogoutHoldTimer(null);
    }
    setLogoutProgress(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-mist-50)",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid var(--color-grey-200)",
          padding: "var(--space-4) var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Wizard Avatar */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--color-navy-500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          🧙
        </div>

        {/* Learner Name */}
        <h1
          style={{
            fontSize: "var(--font-size-h3)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            margin: 0,
          }}
        >
          {learner.displayName}
        </h1>

        {/* Logout Button (tap-and-hold) */}
        <button
          onMouseDown={handleLogoutStart}
          onMouseUp={handleLogoutEnd}
          onMouseLeave={handleLogoutEnd}
          onTouchStart={handleLogoutStart}
          onTouchEnd={handleLogoutEnd}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "var(--color-grey-100)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            position: "relative",
            overflow: "hidden",
          }}
          title="Hold for 3 seconds to logout"
        >
          {/* Progress ring */}
          {logoutProgress > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `conic-gradient(var(--color-error-300) ${logoutProgress}%, transparent ${logoutProgress}%)`,
                borderRadius: "50%",
                opacity: 0.3,
              }}
            />
          )}
          🚪
        </button>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "var(--space-6)",
        }}
      >
        {/* Progress Section */}
        <section
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            marginBottom: "var(--space-6)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <ProgressBar completed={progress.completed} total={progress.total} />
        </section>

        {/* Regular Tasks Section */}
        <section style={{ marginBottom: "var(--space-8)" }}>
          <h2
            style={{
              fontSize: "var(--font-size-h4)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-4)",
            }}
          >
            Your Tasks This Week
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {regularTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                completionsThisWeek={completionsByTask[task.id] || 0}
                onComplete={() => handleTaskClick(task)}
              />
            ))}
          </div>
        </section>

        {/* Boss Tasks Section */}
        {bossTasks.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
              }}
            >
              <span style={{ fontSize: "24px" }}>🏆</span>
              <h2
                style={{
                  fontSize: "var(--font-size-h4)",
                  fontFamily: "var(--font-family-body)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-navy-800)",
                  margin: 0,
                }}
              >
                Boss Tasks
              </h2>
            </div>

            {!progress.bossUnlocked && (
              <p
                style={{
                  fontSize: "var(--font-size-body)",
                  fontFamily: "var(--font-family-body)",
                  color: "var(--color-grey-600)",
                  marginBottom: "var(--space-4)",
                  padding: "var(--space-3) var(--space-4)",
                  backgroundColor: "var(--color-warning-100)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                🔒 Complete {progress.tasksToUnlock} more task
                {progress.tasksToUnlock !== 1 ? "s" : ""} to unlock!
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              {bossTasks.map((task) => (
                <BossTaskCard
                  key={task.id}
                  task={task}
                  completionsThisWeek={completionsByTask[task.id] || 0}
                  isUnlocked={progress.bossUnlocked}
                  tasksToUnlock={progress.tasksToUnlock}
                  onComplete={() => handleTaskClick(task)}
                  onLockedClick={handleLockedBossClick}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Task Completion Modal */}
      {selectedTask && (
        <TaskCompletionModal
          task={selectedTask}
          onConfirm={handleConfirmCompletion}
          onCancel={() => {
            setSelectedTask(null);
            setCompletionError(null);
          }}
          isLoading={isLoading}
          error={completionError}
        />
      )}

      {/* Completion Animation */}
      {showAnimation && (
        <CompletionAnimation
          isBossTask={animationIsBoss}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* Boss Unlock Celebration */}
      {showBossUnlock && (
        <BossUnlockCelebration onDismiss={handleBossUnlockDismiss} />
      )}

      {/* Locked Boss Task Modal */}
      {showLockedModal && (
        <LockedBossTaskModal
          tasksToUnlock={progress.tasksToUnlock}
          completed={progress.completed}
          total={progress.total}
          onDismiss={() => setShowLockedModal(false)}
        />
      )}
    </div>
  );
}
