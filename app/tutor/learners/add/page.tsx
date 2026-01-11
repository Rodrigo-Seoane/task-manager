/**
 * Add Learner Page
 * Route: /tutor/learners/add
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{
              fontFamily: "var(--font-family-display)",
              fontSize: "var(--font-size-h1)",
              lineHeight: "var(--line-height-h1)",
              color: "var(--color-navy-800)",
            }}
          >
            Add New Learner
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-grey-600)",
            }}
          >
            Set up a new learner account with a unique PIN
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
          <AddLearnerForm />
        </div>

        {/* Info Box */}
        <div
          className="mt-6 rounded-lg p-4"
          style={{
            backgroundColor: "var(--color-info-100)",
            border: "1px solid var(--color-info-300)",
          }}
        >
          <h3
            className="mb-2"
            style={{
              fontSize: "var(--font-size-h6)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-info-400)",
            }}
          >
            About Learner Accounts
          </h3>
          <ul
            className="space-y-1"
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-info-400)",
              paddingLeft: "20px",
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
