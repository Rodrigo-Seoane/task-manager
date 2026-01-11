/**
 * Tutor Login Page
 * Route: /tutor/login
 */

import { TutorLoginForm } from "@/components/tutor/TutorLoginForm";

export default function TutorLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-mist-50)" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="mb-2"
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-display)",
              lineHeight: "var(--line-height-display)",
              color: "var(--color-navy-800)",
            }}
          >
            Board Master
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-h5)",
              color: "var(--color-grey-600)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Welcome back, Tutor
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-lg p-8"
          style={{
            backgroundColor: "white",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <TutorLoginForm />
        </div>
      </div>
    </div>
  );
}
