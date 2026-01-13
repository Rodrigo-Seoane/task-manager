"use client";

/**
 * Tutor Navigation Component
 * Top navigation bar for tutor pages
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-6 for padding, --space-4 for gaps)
 * - Used explicit radius token (--radius-md for button)
 * - Improved button height for better touch target (40px = --space-10)
 * - Added hover state for logout button
 * - Enhanced visual hierarchy with proper font weights
 */

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavigationProps {
  tutorName: string;
}

export function Navigation({ tutorName }: NavigationProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/tutor/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid var(--color-grey-200)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-4) var(--space-6)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand - Using display font */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h2)",
              lineHeight: "var(--line-height-h2)",
              color: "var(--color-navy-800)",
            }}
          >
            Board Master
          </h1>
        </div>

        {/* Right Side - Improved spacing */}
        <div
          className="flex items-center"
          style={{ gap: "var(--space-4)" }}
        >
          {/* Tutor Name - Enhanced typography */}
          <span
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-grey-700)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            {tutorName}
          </span>

          {/* Logout Button - Enhanced with proper sizing and hover */}
          <button
            onClick={handleLogout}
            className="transition-colors"
            style={{
              backgroundColor: "var(--color-grey-100)",
              color: "var(--color-grey-700)",
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
              height: "var(--space-10)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-grey-200)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-grey-100)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
