"use client";

/**
 * Boss Unlock Celebration Component
 * Phase 4.4 - Boss Task Completion
 * Celebration modal when boss tasks are unlocked at 80%
 */

import { useMemo } from "react";

interface BossUnlockCelebrationProps {
  onDismiss: () => void;
}

// Seeded random for consistent but varied confetti
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function BossUnlockCelebration({ onDismiss }: BossUnlockCelebrationProps) {
  // Generate confetti pieces with useMemo (stable across renders)
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${seededRandom(i * 7) * 100}%`,
      color: ["#FFD700", "#FFA500", "#FF8C00", "#FFD700", "#DAA520"][
        Math.floor(seededRandom(i * 11) * 5)
      ],
      delay: `${seededRandom(i * 13) * 0.5}s`,
      duration: `${1.5 + seededRandom(i * 17) * 1}s`,
    }));
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      {/* Gold Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            top: "-20px",
            left: piece.left,
            width: "16px",
            height: "16px",
            backgroundColor: piece.color,
            borderRadius: "2px",
            animation: `confetti-fall ${piece.duration} ease-out ${piece.delay} forwards`,
          }}
        />
      ))}

      {/* Celebration Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
          padding: "var(--space-8)",
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          animation: "scale-bounce 0.5s ease-out forwards",
          border: "4px solid #FFD700",
          boxShadow: "0 0 60px rgba(255, 215, 0, 0.5)",
        }}
      >
        {/* Wizard Avatar */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "var(--color-navy-500)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "56px",
            animation: "bounce 1s ease-in-out infinite",
          }}
        >
          🧙
        </div>

        {/* Trophy */}
        <div
          style={{
            fontSize: "80px",
            animation: "trophy-bounce 0.8s ease-out",
          }}
        >
          🏆
        </div>

        {/* Message */}
        <h2
          style={{
            fontSize: "var(--font-size-h2)",
            fontFamily: "var(--font-family-display)",
            color: "var(--color-navy-800)",
            margin: 0,
          }}
        >
          Amazing work!
        </h2>

        <p
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-600)",
            margin: 0,
          }}
        >
          You unlocked the Boss Tasks!
        </p>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4) var(--space-8)",
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            backgroundColor: "#FFD700",
            color: "var(--color-grey-800)",
            border: "none",
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Awesome!
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-bounce {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes trophy-bounce {
          0% {
            transform: scale(0) rotate(-20deg);
          }
          50% {
            transform: scale(1.3) rotate(10deg);
          }
          70% {
            transform: scale(0.9) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
