"use client";

/**
 * Task Form Component
 * Modal form for creating/editing tasks
 * Phase 3.1 - Task Creation UI
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconPicker } from "./IconPicker";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const TaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(50, "Task title must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  iconName: z.string().optional(),
  frequencyPerWeek: z
    .number()
    .int("Frequency must be a whole number")
    .min(1, "Frequency must be at least 1")
    .max(14, "Frequency cannot exceed 14"),
  isBossTask: z.boolean(),
  expectation: z
    .string()
    .max(200, "Expectation must be less than 200 characters")
    .optional(),
});

type TaskFormData = z.infer<typeof TaskFormSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

interface TaskFormProps {
  weeklyCycleId: string;
  onSuccess: () => void;
  onCancel: () => void;
  learnerId?: string;
}

export function TaskForm({ weeklyCycleId, onSuccess, onCancel, learnerId }: TaskFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      frequencyPerWeek: 1,
      isBossTask: false,
    },
  });

  const isBossTask = watch("isBossTask");

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyCycleId,
          title: data.title,
          description: data.description || undefined,
          iconName: selectedIcon || undefined,
          frequencyPerWeek: data.frequencyPerWeek,
          isBossTask: data.isBossTask,
          expectation: data.expectation || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || "Failed to create task");
        setIsLoading(false);
        return;
      }

      // Success - navigate back or call callback
      if (learnerId) {
        router.push(`/tutor/weekly-tasks/${learnerId}`);
      } else {
        router.refresh();
        onSuccess();
      }
    } catch (error) {
      console.error("[TASK_FORM_ERROR]", error);
      setServerError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {/* Server Error */}
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

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Task Title *
        </label>
        <input
          type="text"
          {...register("title")}
          disabled={isLoading}
          placeholder="e.g., Brush teeth, Make bed"
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            border: `1px solid ${
              errors.title ? "var(--color-error-300)" : "var(--color-grey-300)"
            }`,
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            height: "var(--space-12)",
            outline: "none",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-navy-500)";
            e.currentTarget.style.backgroundColor = "white";
          }}
          onBlur={(e) => {
            if (!errors.title) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
        />
        {errors.title && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Icon Picker */}
      <div>
        <label
          htmlFor="iconName"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Task Icon (Optional)
        </label>
        <IconPicker
          selectedIcon={selectedIcon}
          onSelectIcon={(iconName) => {
            setSelectedIcon(iconName);
            setValue("iconName", iconName);
          }}
        />
      </div>

      {/* Frequency Per Week */}
      <div>
        <label
          htmlFor="frequencyPerWeek"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Frequency Per Week
        </label>
        <input
          type="number"
          min="1"
          max="14"
          {...register("frequencyPerWeek", { valueAsNumber: true })}
          disabled={isLoading}
          className="w-full border transition-colors"
          style={{
            borderColor: errors.frequencyPerWeek
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
            if (!errors.frequencyPerWeek) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
        />
        {errors.frequencyPerWeek && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.frequencyPerWeek.message}
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
          How many times per week should this task be done?
        </p>
      </div>

      {/* Expectation Field */}
      <div>
        <label
          htmlFor="expectation"
          style={{
            display: "block",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--color-grey-700)",
            marginBottom: "var(--space-2)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          What does done look like? (Optional)
        </label>
        <textarea
          id="expectation"
          {...register("expectation")}
          disabled={isLoading}
          rows={3}
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            border: `1px solid ${
              errors.expectation
                ? "var(--color-error-300)"
                : "var(--color-grey-300)"
            }`,
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-grey-50)",
            outline: "none",
            resize: "vertical",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-navy-500)";
            e.currentTarget.style.backgroundColor = "white";
          }}
          onBlur={(e) => {
            if (!errors.expectation) {
              e.currentTarget.style.borderColor = "var(--color-grey-300)";
              e.currentTarget.style.backgroundColor = "var(--color-grey-50)";
            }
          }}
          placeholder="Example: Bed made with covers pulled up and pillow straight"
        />
        {errors.expectation && (
          <p
            style={{
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-error-400)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            {errors.expectation.message}
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
          Help your learner know what "done" means (max 200 characters)
        </p>
      </div>

      {/* Boss Task Checkbox */}
      <div
        style={{
          backgroundColor: "var(--color-peach-50)",
          border: "1px solid var(--color-peach-200)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            cursor: "pointer",
            fontFamily: "var(--font-family-body)",
          }}
        >
          <input
            type="checkbox"
            {...register("isBossTask")}
            disabled={isLoading}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          />
          <div>
            <span
              style={{
                fontSize: "var(--font-size-body)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-peach-700)",
              }}
            >
              This is a Boss Task (Reward)
            </span>
            <p
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-peach-600)",
                margin: 0,
                marginTop: "var(--space-1)",
              }}
            >
              Boss Tasks are special rewards unlocked at 80% completion
            </p>
          </div>
        </label>
      </div>

      {/* Fixed Point Value Display */}
      <div
        style={{
          backgroundColor: "var(--color-mist-50)",
          border: "1px solid var(--color-mist-200)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-size-small)",
            fontFamily: "var(--font-family-body)",
            color: "var(--color-grey-600)",
            margin: 0,
          }}
        >
          <strong>Point Value:</strong> {isBossTask ? "0 points" : "10 points"}{" "}
          (fixed)
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <button
          type="button"
          onClick={() => {
            if (learnerId) {
              router.push(`/tutor/weekly-tasks/${learnerId}`);
            } else {
              onCancel();
            }
          }}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "var(--space-3) var(--space-6)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            backgroundColor: "var(--color-grey-100)",
            color: "var(--color-grey-700)",
            border: "none",
            borderRadius: "var(--radius-md)",
            height: "var(--space-12)",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-200)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "var(--space-3) var(--space-6)",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            backgroundColor: isLoading
              ? "var(--color-navy-300)"
              : "var(--color-navy-500)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-md)",
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
          {isLoading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
