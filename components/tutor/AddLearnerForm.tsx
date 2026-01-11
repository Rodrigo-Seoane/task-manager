"use client";

/**
 * Add Learner Form Component
 * Form for creating a new learner with PIN setup
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

      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-grey-700)" }}
        >
          Learner's Display Name
        </label>
        <input
          id="displayName"
          type="text"
          {...register("displayName")}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border transition-colors"
          style={{
            borderColor: errors.displayName
              ? "var(--color-error-300)"
              : "var(--color-grey-300)",
            backgroundColor: "var(--color-grey-50)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
          placeholder="Enter learner's name"
        />
        {errors.displayName && (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-error-400)" }}
          >
            {errors.displayName.message}
          </p>
        )}
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-grey-500)" }}
        >
          This is how they'll see their name in the app
        </p>
      </div>

      {/* PIN Setup */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "var(--color-mist-50)",
          border: "1px solid var(--color-mist-200)",
        }}
      >
        <h3
          className="mb-4"
          style={{
            fontSize: "var(--font-size-h5)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-navy-800)",
          }}
        >
          Set Up PIN Code
        </h3>

        {/* PIN Input */}
        <div className="mb-4">
          <label
            htmlFor="pinCode"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-grey-700)" }}
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
            className="w-full px-4 py-3 rounded-lg border transition-colors text-center tracking-widest"
            style={{
              borderColor: errors.pinCode
                ? "var(--color-error-300)"
                : "var(--color-grey-300)",
              backgroundColor: "white",
              fontSize: "24px",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
            }}
            placeholder="••••"
          />
          {errors.pinCode && (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-error-400)" }}
            >
              {errors.pinCode.message}
            </p>
          )}
        </div>

        {/* Confirm PIN Input */}
        <div>
          <label
            htmlFor="confirmPin"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-grey-700)" }}
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
            className="w-full px-4 py-3 rounded-lg border transition-colors text-center tracking-widest"
            style={{
              borderColor: errors.confirmPin
                ? "var(--color-error-300)"
                : "var(--color-grey-300)",
              backgroundColor: "white",
              fontSize: "24px",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
            }}
            placeholder="••••"
          />
          {errors.confirmPin && (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-error-400)" }}
            >
              {errors.confirmPin.message}
            </p>
          )}
        </div>

        <p
          className="mt-3 text-sm"
          style={{ color: "var(--color-grey-600)" }}
        >
          ℹ️ The learner will use this PIN to log in. Make it easy for them to
          remember!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: "var(--color-grey-100)",
            color: "var(--color-grey-700)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-lg font-medium transition-all"
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
          {isLoading ? "Creating Learner..." : "Create Learner"}
        </button>
      </div>
    </form>
  );
}
