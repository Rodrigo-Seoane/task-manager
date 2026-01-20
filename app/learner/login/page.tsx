/**
 * Learner Login Page
 * Route: /learner/login
 * Phase 4.1 - Independent Learner Login
 *
 * Allows learners to log in without requiring tutor session
 * Uses: Tutor Email + Learner Nickname + PIN
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LearnerLoginForm } from "@/components/learner/LearnerLoginForm";

export default async function LearnerLoginPage() {
  const session = await auth();

  // If already logged in as learner, redirect to dashboard
  if (session && session.user.role === "learner") {
    redirect("/learner/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-mist-50)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6)",
      }}
    >
      {/* App Logo / Title */}
      <h1
        style={{
          fontSize: "var(--font-size-display)",
          fontFamily: "var(--font-family-display)",
          color: "var(--color-navy-800)",
          marginBottom: "var(--space-2)",
          textAlign: "center",
        }}
      >
        Board Master
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "var(--font-size-h3)",
          fontFamily: "var(--font-family-body)",
          color: "var(--color-grey-600)",
          marginBottom: "var(--space-10)",
          textAlign: "center",
        }}
      >
        Learner Login
      </p>

      {/* Login Form Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-8)",
          boxShadow: "var(--shadow-md)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <LearnerLoginForm />
      </div>
    </div>
  );
}
