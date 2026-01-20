"use client";

/**
 * Learner Selection Client Component
 * Phase 4.1 - Learner Login
 * Large, colorful cards for child-friendly selection
 */

import { useRouter } from "next/navigation";

interface Learner {
  id: string;
  displayName: string;
}

interface LearnerSelectionClientProps {
  learners: Learner[];
}

// Simple avatar colors for learners (cycle through)
const AVATAR_COLORS = [
  "var(--color-peach-500)",
  "var(--color-navy-500)",
  "var(--color-mist-500)",
  "var(--color-success-300)",
];

export function LearnerSelectionClient({
  learners,
}: LearnerSelectionClientProps) {
  const router = useRouter();

  const handleSelectLearner = (learnerId: string) => {
    router.push(`/learner/pin?id=${learnerId}`);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          learners.length === 1
            ? "1fr"
            : "repeat(auto-fit, minmax(160px, 200px))",
        gap: "var(--space-6)",
        justifyContent: "center",
        width: "100%",
        maxWidth: "800px",
      }}
    >
      {learners.map((learner, index) => (
        <button
          key={learner.id}
          onClick={() => handleSelectLearner(learner.id)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-4)",
            padding: "var(--space-8)",
            backgroundColor: "white",
            border: "3px solid transparent",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
            minWidth: "160px",
            minHeight: "180px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }}
        >
          {/* Avatar Circle */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              fontFamily: "var(--font-family-display)",
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            {learner.displayName.charAt(0).toUpperCase()}
          </div>

          {/* Learner Name */}
          <span
            style={{
              fontSize: "var(--font-size-h2)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-navy-800)",
              textAlign: "center",
            }}
          >
            {learner.displayName}
          </span>
        </button>
      ))}
    </div>
  );
}
