"use client";

/**
 * WizardMessage Component
 * Phase 6 - Narrative System
 *
 * Displays Tony the Game Wizard with narrative messages.
 * Used across both tutor and learner flows for consistent messaging.
 *
 * Features:
 * - Multiple message pages with navigation
 * - Variable interpolation for dynamic content
 * - Wizard pose images
 * - Dismissible modal overlay
 */

import { useState } from "react";
import Image from "next/image";
import {
  type NarrativeMessageKey,
  type WizardPose,
  getNarrativeMessage,
  wizardImages,
} from "@/lib/constants/narrative";

interface WizardMessageProps {
  /**
   * The narrative message key to display
   */
  messageKey: NarrativeMessageKey;

  /**
   * Variables for message interpolation
   * e.g., { learner_name: "Alex", points: 45 }
   */
  variables?: Record<string, string | number>;

  /**
   * Callback when user dismisses the message
   */
  onDismiss: () => void;

  /**
   * Optional custom action for the button (instead of just dismiss)
   */
  onAction?: () => void;

  /**
   * Optional custom button text override
   */
  buttonTextOverride?: string;
}

export function WizardMessage({
  messageKey,
  variables,
  onDismiss,
  onAction,
  buttonTextOverride,
}: WizardMessageProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const { messages, buttonText, wizardPose } = getNarrativeMessage(
    messageKey,
    variables
  );

  const totalPages = messages.length;
  const isLastPage = currentPage === totalPages - 1;
  const currentMessage = messages[currentPage];

  const handleNext = () => {
    if (isLastPage) {
      if (onAction) {
        onAction();
      }
      onDismiss();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const finalButtonText = buttonTextOverride || buttonText;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "var(--space-4)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-message-title"
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "var(--radius-lg)",
          maxWidth: "420px",
          width: "100%",
          padding: "var(--space-8)",
          textAlign: "center",
          animation: "wizard-message-appear 0.3s ease-out forwards",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Wizard Avatar */}
        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto var(--space-6) auto",
            position: "relative",
          }}
        >
          <Image
            src={wizardImages[wizardPose]}
            alt="Tony the Game Wizard"
            width={120}
            height={120}
            style={{
              objectFit: "contain",
            }}
            priority
          />
        </div>

        {/* Message */}
        <p
          id="wizard-message-title"
          style={{
            fontSize: "var(--font-size-h4)",
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-navy-800)",
            lineHeight: "var(--line-height-normal)",
            marginBottom: "var(--space-6)",
            minHeight: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentMessage}
        </p>

        {/* Page Indicators (if multiple pages) */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-2)",
              marginBottom: "var(--space-6)",
            }}
          >
            {messages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor:
                    index === currentPage
                      ? "var(--color-navy-500)"
                      : "var(--color-grey-300)",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  padding: 0,
                }}
                aria-label={`Go to message ${index + 1}`}
                aria-current={index === currentPage ? "true" : undefined}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
          }}
        >
          {/* Previous Button (if not first page) */}
          {currentPage > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                padding: "var(--space-3) var(--space-6)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-medium)",
                backgroundColor: "transparent",
                color: "var(--color-grey-600)",
                border: "1px solid var(--color-grey-300)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Back
            </button>
          )}

          {/* Next/Action Button */}
          <button
            onClick={handleNext}
            style={{
              padding: "var(--space-3) var(--space-8)",
              fontSize: "var(--font-size-h5)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-semibold)",
              backgroundColor: "var(--color-navy-500)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: "140px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-navy-600)";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-navy-500)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isLastPage ? finalButtonText : "Next"}
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes wizard-message-appear {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
