"use client";

/**
 * Add Task Client Wrapper
 * Client component wrapper for TaskForm to handle navigation-based flow
 * Phase 3.1 - Task Creation UI
 */

import { TaskForm } from "./TaskForm";

interface AddTaskClientProps {
  weeklyCycleId: string;
  learnerId: string;
}

export function AddTaskClient({ weeklyCycleId, learnerId }: AddTaskClientProps) {
  return (
    <TaskForm
      weeklyCycleId={weeklyCycleId}
      onSuccess={() => {}}
      onCancel={() => {}}
      learnerId={learnerId}
    />
  );
}
