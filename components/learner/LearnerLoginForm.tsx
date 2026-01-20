"use client";

/**
 * Learner Login Form Component
 * Phase 4.1 - Independent Learner Login
 *
 * Form fields: Tutor Email, Learner Nickname, PIN
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LearnerLoginForm() {
  const router = useRouter();
  const [tutorEmail, setTutorEmail] = useState("");
  const [learnerName, setLearnerName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("learner", {
        tutorEmail,
        learnerName,
        pin,
        userType: "learner",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your tutor email, name, and PIN.");
        setIsLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/learner/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[LEARNER_LOGIN_ERROR]", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "var(--color-error-100)",
            border: "1px solid var(--color-error-300)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3) var(--space-4)",
            marginBottom: "var(--space-6)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              color: "var(--color-error-400)",
              margin: 0,
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Tutor Email Field */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <label
          htmlFor="tutorEmail"
          style={{
            display: "block",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-2)",
          }}
        >
          Tutor Email
        </label>
        <input
          id="tutorEmail"
          type="email"
          value={tutorEmail}
          onChange={(e) => setTutorEmail(e.target.value)}
          placeholder="tutor@example.com"
          required
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <p
          style={{
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-500)",
            marginTop: "var(--space-1)",
          }}
        >
          Your tutor&apos;s email address
        </p>
      </div>

      {/* Learner Name Field */}
      <div style={{ marginBottom: "var(--space-5)" }}>
        <label
          htmlFor="learnerName"
          style={{
            display: "block",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-2)",
          }}
        >
          Your Name
        </label>
        <input
          id="learnerName"
          type="text"
          value={learnerName}
          onChange={(e) => setLearnerName(e.target.value)}
          placeholder="Enter your name"
          required
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* PIN Field */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <label
          htmlFor="pin"
          style={{
            display: "block",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-2)",
          }}
        >
          PIN
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="4-digit PIN"
          required
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-h3)",
            fontFamily: "var(--font-family-body)",
            border: "1px solid var(--color-grey-300)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.5em",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || pin.length !== 4}
        style={{
          width: "100%",
          padding: "var(--space-4)",
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-semibold)",
          backgroundColor:
            isLoading || pin.length !== 4
              ? "var(--color-grey-300)"
              : "var(--color-peach-500)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: isLoading || pin.length !== 4 ? "not-allowed" : "pointer",
          transition: "all var(--transition-fast)",
        }}
      >
        {isLoading ? "Logging in..." : "Start Playing!"}
      </button>
    </form>
  );
}
