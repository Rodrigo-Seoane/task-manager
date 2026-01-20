"use client";

/**
 * Waiting Client Component
 * Phase 4.2 - Shown when no ACTIVE cycle exists
 */

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface WaitingClientProps {
  learnerName: string;
}

export function WaitingClient({ learnerName }: WaitingClientProps) {
  const router = useRouter();

  const handleCheckAgain = () => {
    router.refresh();
  };

  const handleLogout = async () => {
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
      {/* Wizard Avatar (relaxed pose) */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "var(--color-navy-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          marginBottom: "var(--space-8)",
        }}
      >
        🧙
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
        Hi, {learnerName}!
      </h1>

      {/* Message */}
      <p
        style={{
          fontSize: "var(--font-size-h4)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          marginBottom: "var(--space-8)",
          maxWidth: "400px",
        }}
      >
        Your tutor is setting up your new week. Check back soon!
      </p>

      {/* Illustration */}
      <div
        style={{
          fontSize: "80px",
          marginBottom: "var(--space-8)",
        }}
      >
        📋✨
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <button
          onClick={handleCheckAgain}
          style={{
            padding: "var(--space-4) var(--space-8)",
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
          Check Again
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "var(--space-3) var(--space-6)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor: "transparent",
            color: "var(--color-grey-500)",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
