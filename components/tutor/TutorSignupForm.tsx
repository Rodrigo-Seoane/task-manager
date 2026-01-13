"use client";

/**
 * Tutor Signup Form Component
 * Form with validation for tutor registration
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-6 for form fields)
 * - Used explicit radius tokens (--radius-md for inputs, alerts, and buttons)
 * - Improved input height for better touch targets (48px = --space-12)
 * - Added hover/focus states for better interactivity
 * - Increased label spacing and weight for better hierarchy
 * - Enhanced button states with proper transitions
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const SignupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof SignupSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

export function TutorSignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/auth/tutor/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Redirect to login page
      router.push("/tutor/login?registered=true");
    } catch (error) {
      console.error("[SIGNUP_ERROR]", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
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

      {/* Full Name - Enhanced spacing and touch targets */}
      <div>
        <label
          htmlFor="fullName"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register("fullName")}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.fullName
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
            if (!errors.fullName) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

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
          placeholder="At least 8 characters"
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

      {/* Confirm Password - Enhanced spacing and touch targets */}
      <div>
        <label
          htmlFor="confirmPassword"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.confirmPassword
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
            if (!errors.confirmPassword) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="Re-enter your password"
        />
        {errors.confirmPassword && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.confirmPassword.message}
          </p>
        )}
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
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Link - Enhanced spacing and sizing */}
      <p
        className="text-center"
        style={{
          fontSize: "var(--font-size-small)",
          color: "var(--color-grey-600)",
          fontFamily: "var(--font-family-body)",
        }}
      >
        Already have an account?{" "}
        <a
          href="/tutor/login"
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
          Log in
        </a>
      </p>
    </form>
  );
}
