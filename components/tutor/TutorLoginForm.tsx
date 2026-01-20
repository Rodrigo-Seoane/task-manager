"use client";

/**
 * Tutor Login Form Component
 * Form with validation for tutor authentication
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-6 for form fields)
 * - Used explicit radius tokens (--radius-md for inputs, alerts, and buttons)
 * - Improved input height for better touch targets (48px = --space-12)
 * - Added hover/focus states for better interactivity
 * - Increased label spacing and weight for better hierarchy
 * - Enhanced button states with proper transitions
 */

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

function TutorLoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await signIn("tutor", {
        email: data.email,
        password: data.password,
        userType: "tutor",
        redirect: false,
      });

      if (!result) {
        setServerError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      if (result.error) {
        setServerError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/tutor/dashboard");
      router.refresh();
    } catch (error) {
      console.error("[LOGIN_ERROR]", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Success Message - Enhanced with explicit tokens */}
      {registered && (
        <div
          style={{
            backgroundColor: "var(--color-success-100)",
            color: "var(--color-success-400)",
            border: "1px solid var(--color-success-300)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Account created successfully! Please log in.
        </div>
      )}

      {/* Server Error - Enhanced with explicit tokens */}
      {serverError && (
        <div
          style={{
            backgroundColor: "var(--color-error-100)",
            color: "var(--color-error-400)",
            border: "1px solid var(--color-error-300)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-4)",
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          {serverError}
        </div>
      )}

      {/* Email - Enhanced spacing and touch targets */}
      <div>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.email
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            height: "var(--space-12)",
            outline: "none",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-navy-500)";
            e.currentTarget.style.backgroundColor = "white";
          }}
          onBlur={(e) => {
            if (!errors.email) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password - Enhanced spacing and touch targets */}
      <div>
        <label
          htmlFor="password"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.password
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            height: "var(--space-12)",
            outline: "none",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-navy-500)";
            e.currentTarget.style.backgroundColor = "white";
          }}
          onBlur={(e) => {
            if (!errors.password) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot Password Link - Enhanced with hover state */}
      <div style={{ textAlign: "right" }}>
        <a
          href="#"
          style={{
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-navy-500)",
            fontFamily: "var(--font-family-body)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button - Enhanced with proper height and hover states */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full transition-all"
        style={{
          backgroundColor: isLoading
            ? "var(--color-navy-300)"
            : "var(--color-navy-500)",
          color: "white",
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          fontWeight: "var(--font-weight-semibold)",
          cursor: isLoading ? "not-allowed" : "pointer",
          padding: "var(--space-3) var(--space-6)",
          borderRadius: "var(--radius-md)",
          border: "none",
          height: "var(--space-12)",
          transition: "all var(--transition-fast)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = "var(--color-navy-600)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </button>

      {/* Signup Link - Enhanced spacing and sizing */}
      <p
        className="text-center"
        style={{
          fontSize: "var(--font-size-small)",
          color: "var(--color-grey-600)",
          fontFamily: "var(--font-family-body)",
        }}
      >
        Don&apos;t have an account?{" "}
        <a
          href="/tutor/signup"
          style={{
            color: "var(--color-navy-500)",
            fontWeight: "var(--font-weight-medium)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          Sign up
        </a>
      </p>
    </form>
  );
}

export function TutorLoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TutorLoginFormInner />
    </Suspense>
  );
}
