/**
 * Board Master - Home Page
 * Landing page with links to tutor and learner portals
 */

import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-mist-50)" }}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Logo/Title */}
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "var(--font-size-display)",
            lineHeight: "var(--line-height-display)",
            color: "var(--color-navy-800)",
          }}
        >
          Board Master
        </h1>

        {/* Subtitle */}
        <p
          className="mb-12"
          style={{
            fontSize: "var(--font-size-h4)",
            color: "var(--color-grey-600)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          Gamified task management for learners
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Tutor Card */}
          <Link
            href="/tutor/login"
            className="rounded-lg p-8 transition-all hover:shadow-lg"
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
              border: "2px solid var(--color-navy-500)",
            }}
          >
            <div
              className="rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "var(--color-navy-100)",
                fontSize: "40px",
              }}
            >
              👨‍🏫
            </div>
            <h2
              className="mb-2"
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
              }}
            >
              Tutor Portal
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
              }}
            >
              Manage learners and create weekly tasks
            </p>
          </Link>

          {/* Learner Card */}
          <Link
            href="/learner/select"
            className="rounded-lg p-8 transition-all hover:shadow-lg"
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
              border: "2px solid var(--color-peach-500)",
            }}
          >
            <div
              className="rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "var(--color-peach-100)",
                fontSize: "40px",
              }}
            >
              🎮
            </div>
            <h2
              className="mb-2"
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
              }}
            >
              Learner Portal
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
              }}
            >
              Complete tasks and track your progress
            </p>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-12">
          <p
            className="text-sm"
            style={{ color: "var(--color-grey-500)" }}
          >
            Phase 2: Tutor Onboarding Complete
          </p>
        </div>
      </div>
    </div>
  );
}
