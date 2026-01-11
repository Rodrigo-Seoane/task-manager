"use client";

/**
 * Tutor Signup Form Component
 * Form with validation for tutor registration
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error */}
      {serverError && (
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            backgroundColor: "var(--color-error-100)",
            color: "var(--color-error-400)",
            border: "1px solid var(--color-error-300)",
          }}
        >
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-grey-700)" }}
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register("fullName")}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            borderColor: errors.fullName
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-error-400)" }}
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-grey-700)" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            borderColor: errors.email
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-error-400)" }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-grey-700)" }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            borderColor: errors.password
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
          placeholder="At least 8 characters"
        />
        {errors.password && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-error-400)" }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-grey-700)" }}
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            borderColor: errors.confirmPassword
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
          placeholder="Re-enter your password"
        />
        {errors.confirmPassword && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-error-400)" }}
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-lg font-medium transition-all"
        style={{
          backgroundColor: isLoading
            ? "var(--color-navy-300)"
            : "var(--color-navy-500)",
          color: "white",
          fontSize: "var(--font-size-body)",
          fontFamily: "var(--font-family-body)",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Login Link */}
      <p
        className="text-center text-sm"
        style={{ color: "var(--color-grey-600)" }}
      >
        Already have an account?{" "}
        <a
          href="/tutor/login"
          className="font-medium"
          style={{ color: "var(--color-navy-500)" }}
        >
          Log in
        </a>
      </p>
    </form>
  );
}
