/**
 * Board Master - Home Page
 * Landing page with links to tutor and learner portals
 *
 * UI REDESIGN CHANGES:
 * - Increased vertical spacing using 8px grid (--space-16, --space-8)
 * - Used explicit radius tokens (--radius-lg for cards, --radius-pill for icons)
 * - Improved visual hierarchy with larger icon containers (96px, child-friendly touch target)
 * - Added transition tokens for consistent animation
 * - Increased spacing between elements for better breathing room
 * - Made CTAs more prominent with better contrast and spacing
 * - Hover states handled via inline CSS for server component compatibility
 */

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "var(--color-mist-50)",
        padding: "var(--space-6)",
      }}
    >

      <div className="max-w-4xl w-full text-center">
        {/* Logo/Title - Increased bottom spacing */}
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "var(--font-size-display)",
            lineHeight: "var(--line-height-display)",
            color: "var(--color-navy-800)",
            marginBottom: "var(--space-4)",
          }}
        >
          Board Master
        </h1>

        {/* Subtitle - Increased bottom spacing for relaxed rhythm */}
        <p
          style={{
            fontSize: "var(--font-size-h4)",
            color: "var(--color-grey-600)",
            fontFamily: "var(--font-family-body)",
            marginBottom: "var(--space-16)",
          }}
        >
          Gamified task management for learners
        </p>

        {/* Action Cards - Increased gap for better visual separation */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
          style={{ gap: "var(--space-8)" }}
        >
          {/* Tutor Card - Enhanced with better hover states and spacing */}
          <Link
            href="/tutor/login"
            className={styles.portalCard}
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
              border: "2px solid var(--color-navy-500)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-10)",
              display: "block",
            }}
          >
            {/* Icon Container - Larger for better visibility (child-friendly) */}
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: "96px",
                height: "96px",
                backgroundColor: "var(--color-navy-100)",
                borderRadius: "var(--radius-pill)",
                fontSize: "48px",
                marginBottom: "var(--space-6)",
              }}
            >
              👨‍🏫
            </div>
            <h2
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
                marginBottom: "var(--space-3)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Tutor Portal
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Manage learners and create weekly tasks
            </p>
          </Link>

          {/* Learner Card - Enhanced with better hover states and spacing */}
          <Link
            href="/learner/login"
            className={styles.portalCard}
            style={{
              backgroundColor: "white",
              boxShadow: "var(--shadow-md)",
              border: "2px solid var(--color-peach-500)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-10)",
              display: "block",
            }}
          >
            {/* Icon Container - Larger for better visibility (child-friendly) */}
            <div
              className="flex items-center justify-center mx-auto"
              style={{
                width: "96px",
                height: "96px",
                backgroundColor: "var(--color-peach-100)",
                borderRadius: "var(--radius-pill)",
                fontSize: "48px",
                marginBottom: "var(--space-6)",
              }}
            >
              🎮
            </div>
            <h2
              style={{
                fontSize: "var(--font-size-h3)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--color-navy-800)",
                marginBottom: "var(--space-3)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Learner Portal
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                color: "var(--color-grey-600)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              Complete tasks and track your progress
            </p>
          </Link>
        </div>

        {/* Footer Info - Increased top spacing */}
        <div style={{ marginTop: "var(--space-16)" }}>
          <p
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-grey-500)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Phase 4: Learner Experience Complete
          </p>
        </div>
      </div>
    </div>
  );
}
