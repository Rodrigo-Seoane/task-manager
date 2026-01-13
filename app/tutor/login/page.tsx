/**
 * Tutor Login Page
 * Route: /tutor/login
 *
 * UI REDESIGN CHANGES:
 * - Increased spacing using 8px grid tokens (--space-6, --space-10)
 * - Used explicit radius token (--radius-lg)
 * - Added proper padding to container for mobile
 * - Increased vertical spacing between header and form for better hierarchy
 * - Improved subtitle sizing for better readability
 */

import { TutorLoginForm } from "@/components/tutor/TutorLoginForm";

export default function TutorLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-mist-50)",
        padding: "var(--space-6)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header - Increased spacing for better hierarchy */}
        <div
          className="text-center"
          style={{ marginBottom: "var(--space-10)" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-display)",
              lineHeight: "var(--line-height-display)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-3)",
            }}
          >
            Board Master
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-h4)",
              color: "var(--color-grey-600)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Welcome back, Tutor
          </p>
        </div>

        {/* Form Card - Using explicit radius and spacing tokens */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "var(--shadow-md)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-10)",
          }}
        >
          <TutorLoginForm />
        </div>
      </div>
    </div>
  );
}
