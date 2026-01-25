"use client";

/**
 * Week Review Client Component
 * Phase 4.2 - Shown when weekly_cycle.status = REVIEW
 * Phase 6 - Updated to use narrative constants
 */

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  type NarrativeMessageKey,
  getNarrativeMessage,
  wizardImages,
} from "@/lib/constants/narrative";

interface WeekReviewClientProps {
  learnerName: string;
  tasksCompleted: number;
  totalTasks: number;
  pointsEarned: number;
  reached80Percent: boolean;
  completedBossTasks: boolean;
}

export function WeekReviewClient({
  learnerName,
  tasksCompleted,
  totalTasks,
  pointsEarned,
  reached80Percent,
  completedBossTasks,
}: WeekReviewClientProps) {
  const router = useRouter();

  // Phase 6: Determine which narrative message to use
  let messageKey: NarrativeMessageKey;
  if (reached80Percent && completedBossTasks) {
    messageKey = "weekReviewComplete80Plus";
  } else if (reached80Percent && !completedBossTasks) {
    messageKey = "weekReviewComplete80PlusNoBoss";
  } else {
    messageKey = "weekReviewCompleteBelow80";
  }

  const { messages, buttonText, wizardPose } = getNarrativeMessage(messageKey, {
    points: pointsEarned,
    completed: tasksCompleted,
    total: totalTasks,
  });

  const handleOkay = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/learner/login");
    } catch (error) {
      console.error("[LOGOUT_ERROR]", error);
      // Force navigation even if signOut fails
      window.location.href = "/learner/login";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-mist-50)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
        textAlign: "center",
      }}
    >
      {/* Wizard Avatar - Phase 6: Use wizard image */}
      <div
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "var(--space-8)",
        }}
      >
        <Image
          src={wizardImages[wizardPose]}
          alt="Tony the Game Wizard"
          width={120}
          height={120}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Greeting */}
      <h1
        style={{
          fontSize: "var(--font-size-h2)",
          fontFamily: "var(--font-family-display)",
          color: "var(--color-navy-800)",
          marginBottom: "var(--space-4)",
        }}
      >
        Great job, {learnerName}!
      </h1>

      {/* Message - Phase 6: Use narrative messages */}
      <p
        style={{
          fontSize: "var(--font-size-h4)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          marginBottom: "var(--space-4)",
          maxWidth: "400px",
        }}
      >
        {messages[0]}
      </p>

      {messages[1] && (
        <p
          style={{
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-500)",
            marginBottom: "var(--space-8)",
            maxWidth: "400px",
          }}
        >
          {messages[1]}
        </p>
      )}

      {/* Illustration - Completed Tasks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
          marginBottom: "var(--space-8)",
          padding: "var(--space-6)",
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            fontSize: "48px",
          }}
        >
          📋✅
        </div>
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            margin: 0,
          }}
        >
          {tasksCompleted} of {totalTasks} tasks completed!
        </p>
        {pointsEarned > 0 && (
          <p
            style={{
              fontSize: "var(--font-size-body)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-grey-600)",
              margin: 0,
            }}
          >
            +{pointsEarned} points earned
          </p>
        )}
      </div>

      {/* Okay Button - Phase 6: Use narrative button text */}
      <button
        onClick={handleOkay}
        style={{
          padding: "var(--space-4) var(--space-10)",
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
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}
