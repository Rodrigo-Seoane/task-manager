"use client";

/**
 * Add Learner Form Component
 * Form for creating a new learner with PIN setup
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-6 for form gap, --space-2 for labels)
 * - Used explicit radius tokens (--radius-md for inputs, --radius-lg for PIN container)
 * - Improved input height for better touch targets (48px = --space-12)
 * - Added focus/blur states for better interactivity
 * - Increased label spacing and weight for better hierarchy
 * - Enhanced button states with proper transitions and hover effects
 * - Used CSS variable for PIN font size (--font-size-h3) instead of hardcoded 24px
 * - Consistent with TutorLoginForm and TutorSignupForm patterns
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const AddLearnerSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters"),
  pinCode: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only numbers"),
  confirmPin: z.string(),
}).refine((data) => data.pinCode === data.confirmPin, {
  message: "PINs do not match",
  path: ["confirmPin"],
});

type AddLearnerFormData = z.infer<typeof AddLearnerSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

export function AddLearnerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddLearnerFormData>({
    resolver: zodResolver(AddLearnerSchema),
  });

  const handlePinInput = (value: string, field: "pinCode" | "confirmPin") => {
    // Only allow digits and max 4 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 4);

    if (field === "pinCode") {
      setPin(sanitized);
      setValue("pinCode", sanitized, { shouldValidate: true });
    } else {
      setConfirmPin(sanitized);
      setValue("confirmPin", sanitized, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: AddLearnerFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/learners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: data.displayName,
          pinCode: data.pinCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Failed to create learner");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/tutor/dashboard");
      router.refresh();
    } catch (error) {
      console.error("[ADD_LEARNER_ERROR]", error);
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

      {/* Display Name - Enhanced spacing and touch targets */}
      <div>
        <label
          htmlFor="displayName"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Learner&apos;s Display Name
        </label>
        <input
          id="displayName"
          type="text"
          {...register("displayName")}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.displayName
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
            if (!errors.displayName) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="Enter learner's name"
        />
        {errors.displayName && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.displayName.message}
          </p>
        )}
        <p
          style={{
            marginTop: "var(--space-2)",
            fontSize: "var(--font-size-small)",
            color: "var(--color-grey-500)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          This is how they&apos;ll see their name in the app
        </p>
      </div>

      {/* PIN Setup - Enhanced with explicit tokens */}
      <div
        style={{
          backgroundColor: "var(--color-mist-50)",
          border: "1px solid var(--color-mist-200)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-h5)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-5)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Set Up PIN Code
        </h3>

        {/* PIN Input - Enhanced spacing and touch targets */}
        <div style={{ marginBottom: "var(--space-5)" }}>
          <label
            htmlFor="pinCode"
            style={{
              display: "block",
              fontSize: "var(--font-size-small)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-grey-700)",
              marginBottom: "var(--space-2)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            4-Digit PIN
          </label>
          <input
            id="pinCode"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={pin}
            onChange={(e) => handlePinInput(e.target.value, "pinCode")}
            disabled={isLoading}
            className="w-full border transition-colors text-center tracking-widest"
            style={{
              borderColor: errors.pinCode
                ? "var(--color-error-300)"
                : "var(--color-grey-300)",
              backgroundColor: "white",
              fontSize: "var(--font-size-h3)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              height: "var(--space-12)",
              outline: "none",
              transition: "all var(--transition-fast)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-navy-500)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
            onBlur={(e) => {
              if (!errors.pinCode) {
                e.currentTarget.style.borderColor = "var(--color-grey-300)";
              }
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="••••"
          />
          {errors.pinCode && (
            <p
              style={{
                marginTop: "var(--space-2)",
                fontSize: "var(--font-size-small)",
                color: "var(--color-error-400)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              {errors.pinCode.message}
            </p>
          )}
        </div>

        {/* Confirm PIN Input - Enhanced spacing and touch targets */}
        <div>
          <label
            htmlFor="confirmPin"
            style={{
              display: "block",
              fontSize: "var(--font-size-small)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-grey-700)",
              marginBottom: "var(--space-2)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Confirm PIN
          </label>
          <input
            id="confirmPin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={confirmPin}
            onChange={(e) => handlePinInput(e.target.value, "confirmPin")}
            disabled={isLoading}
            className="w-full border transition-colors text-center tracking-widest"
            style={{
              borderColor: errors.confirmPin
                ? "var(--color-error-300)"
                : "var(--color-grey-300)",
              backgroundColor: "white",
              fontSize: "var(--font-size-h3)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              height: "var(--space-12)",
              outline: "none",
              transition: "all var(--transition-fast)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-navy-500)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
            onBlur={(e) => {
              if (!errors.confirmPin) {
                e.currentTarget.style.borderColor = "var(--color-grey-300)";
              }
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="••••"
          />
          {errors.confirmPin && (
            <p
              style={{
                marginTop: "var(--space-2)",
                fontSize: "var(--font-size-small)",
                color: "var(--color-error-400)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              {errors.confirmPin.message}
            </p>
          )}
        </div>

        <p
          style={{
            marginTop: "var(--space-4)",
            fontSize: "var(--font-size-small)",
            color: "var(--color-grey-600)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          ℹ️ The learner will use this PIN to log in. Make it easy for them to
          remember!
        </p>
      </div>

      {/* Action Buttons - Enhanced with proper height and hover states */}
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 transition-all"
          style={{
            backgroundColor: "var(--color-grey-100)",
            color: "var(--color-grey-700)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            padding: "var(--space-3) var(--space-6)",
            borderRadius: "var(--radius-md)",
            border: "none",
            height: "var(--space-12)",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-200)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 transition-all"
          style={{
            backgroundColor: isLoading
              ? "var(--color-navy-300)"
              : "var(--color-navy-500)",
            color: "white",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            padding: "var(--space-3) var(--space-6)",
            borderRadius: "var(--radius-md)",
            border: "none",
            height: "var(--space-12)",
            cursor: isLoading ? "not-allowed" : "pointer",
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
          {isLoading ? "Creating Learner..." : "Create Learner"}
        </button>
      </div>
    </form>
  );
}
