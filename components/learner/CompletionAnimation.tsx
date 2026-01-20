"use client";

/**
 * Completion Animation Component
 * Phase 4.3 - Task Completion
 * Checkmark animation with confetti, auto-dismisses after 2 seconds
 */

import { useEffect, useMemo } from "react";

interface CompletionAnimationProps {
  isBossTask?: boolean;
  onComplete: () => void;
}

// Seeded random for consistent but varied confetti
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function CompletionAnimation({
  isBossTask = false,
  onComplete,
}: CompletionAnimationProps) {
  // Generate confetti pieces with useMemo (stable across renders)
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${seededRandom(i * 7) * 100}%`,
      color: [
        "var(--color-peach-500)",
        "var(--color-navy-500)",
        "var(--color-success-300)",
        "#FFD700",
        "var(--color-mist-500)",
      ][Math.floor(seededRandom(i * 11) * 5)],
      delay: `${seededRandom(i * 13) * 0.5}s`,
      duration: `${1 + seededRandom(i * 17) * 1}s`,
    }));
  }, []);

  // Auto-dismiss after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            top: "-20px",
            left: piece.left,
            width: "12px",
            height: "12px",
            backgroundColor: piece.color,
            borderRadius: "2px",
            animation: `confetti-fall ${piece.duration} ease-out ${piece.delay} forwards`,
          }}
        />
      ))}

      {/* Success Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
          animation: "scale-in 0.3s ease-out forwards",
        }}
      >
        {/* Checkmark Circle */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: isBossTask ? "#FFD700" : "var(--color-success-300)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 0.5s ease-out",
            boxShadow: `0 0 40px ${
              isBossTask ? "rgba(255, 215, 0, 0.6)" : "rgba(157, 211, 95, 0.6)"
            }`,
          }}
        >
          <span
            style={{
              fontSize: "64px",
              animation: "checkmark-pop 0.4s ease-out 0.2s forwards",
              opacity: 0,
              transform: "scale(0)",
            }}
          >
            {isBossTask ? "🏆" : "✓"}
          </span>
        </div>

        {/* Success Message */}
        <p
          style={{
            fontSize: "var(--font-size-h2)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            color: "white",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            animation: "fade-in 0.3s ease-out 0.3s forwards",
            opacity: 0,
          }}
        >
          {isBossTask ? "Boss Task Complete!" : "Task complete!"}
        </p>
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

        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark-pop {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
