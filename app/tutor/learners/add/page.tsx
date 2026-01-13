/**
 * Add Learner Page
 * Route: /tutor/learners/add
 *
 * UI REDESIGN CHANGES:
 * - Used explicit spacing tokens (--space-10, --space-8, --space-6)
 * - Used explicit radius tokens (--radius-lg, --radius-md)
 * - Improved spacing hierarchy for header and form
 * - Enhanced info box styling with better visual separation
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navigation } from "@/components/tutor/Navigation";
import { AddLearnerForm } from "@/components/tutor/AddLearnerForm";
import { prisma } from "@/lib/prisma";

export default async function AddLearnerPage() {
  const session = await auth();

  // Redirect if not authenticated or not a tutor
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  // Fetch tutor info
  const tutor = await prisma.tutor.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      learners: {
        select: { id: true },
      },
    },
  });

  if (!tutor) {
    redirect("/tutor/login");
  }

  // Check if tutor has reached max learners
  if (tutor.learners.length >= 4) {
    redirect("/tutor/dashboard");
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-mist-50)" }}
    >
      {/* Navigation */}
      <Navigation tutorName={tutor.fullName} />

      {/* Main Content - Enhanced spacing */}
      <main
        className="max-w-3xl mx-auto"
        style={{
          padding: "var(--space-10) var(--space-6)",
        }}
      >
        {/* Header - Increased spacing */}
        <div style={{ marginBottom: "var(--space-10)" }}>
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h1)",
              lineHeight: "var(--line-height-h1)",
              color: "var(--color-navy-800)",
              marginBottom: "var(--space-3)",
            }}
          >
            Add New Learner
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-grey-600)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Set up a new learner account with a unique PIN
          </p>
        </div>

        {/* Form Card - Using explicit tokens */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "var(--shadow-md)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-10)",
          }}
        >
          <AddLearnerForm />
        </div>

        {/* Info Box - Enhanced with proper spacing */}
        <div
          style={{
            backgroundColor: "var(--color-info-100)",
            border: "1px solid var(--color-info-300)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-5)",
            marginTop: "var(--space-8)",
          }}
        >
          <h3
            style={{
              fontSize: "var(--font-size-h6)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-info-400)",
              fontFamily: "var(--font-family-body)",
              marginBottom: "var(--space-3)",
            }}
          >
            About Learner Accounts
          </h3>
          <ul
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-info-400)",
              fontFamily: "var(--font-family-body)",
              paddingLeft: "var(--space-5)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <li>Each learner gets their own account with a 4-digit PIN</li>
            <li>You can add up to 4 learners per tutor account</li>
            <li>Learners will use their PIN to log in and complete tasks</li>
            <li>PINs must be unique for each learner</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
