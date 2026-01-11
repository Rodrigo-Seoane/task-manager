"use client";

/**
 * Tutor Login Form Component
 * Form with validation for tutor authentication
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {registered && (
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            backgroundColor: "var(--color-success-100)",
            color: "var(--color-success-400)",
            border: "1px solid var(--color-success-300)",
          }}
        >
          Account created successfully! Please log in.
        </div>
      )}

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
          placeholder="Enter your password"
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

      {/* Forgot Password Link */}
      <div className="text-right">
        <a
          href="#"
          className="text-sm font-medium"
          style={{ color: "var(--color-navy-500)" }}
        >
          Forgot password?
        </a>
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
        {isLoading ? "Logging in..." : "Log In"}
      </button>

      {/* Signup Link */}
      <p
        className="text-center text-sm"
        style={{ color: "var(--color-grey-600)" }}
      >
        Don't have an account?{" "}
        <a
          href="/tutor/signup"
          className="font-medium"
          style={{ color: "var(--color-navy-500)" }}
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
