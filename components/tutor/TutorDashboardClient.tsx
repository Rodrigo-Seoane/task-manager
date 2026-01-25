"use client";

/**
 * Tutor Dashboard Client Component
 * Phase 6 - Narrative System Integration
 *
 * Wraps the dashboard content with wizard message functionality
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardMessage } from "@/components/shared/WizardMessage";

interface TutorDashboardClientProps {
  showWelcome: boolean;
  children: React.ReactNode;
}

export function TutorDashboardClient({
  showWelcome,
  children,
}: TutorDashboardClientProps) {
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(showWelcome);

  const handleDismiss = async () => {
    // Mark onboarding as completed
    try {
      await fetch("/api/tutor/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[ONBOARDING_ERROR]", error);
    }

    setShowWizard(false);
  };

  const handleAction = () => {
    // Navigate to add learner page
    router.push("/tutor/learners/add");
  };

  return (
    <>
      {children}

      {/* Phase 6: Tutor Welcome Wizard */}
      {showWizard && (
        <WizardMessage
          messageKey="tutorWelcome"
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      )}
    </>
  );
}
