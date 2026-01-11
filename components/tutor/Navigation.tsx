"use client";

/**
 * Tutor Navigation Component
 * Top navigation bar for tutor pages
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
      className="px-6 py-4"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid var(--color-grey-200)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h2)",
              color: "var(--color-navy-800)",
            }}
          >
            Board Master
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Tutor Name */}
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-grey-100)",
              color: "var(--color-grey-700)",
              fontSize: "var(--font-size-small)",
              fontFamily: "var(--font-family-body)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
