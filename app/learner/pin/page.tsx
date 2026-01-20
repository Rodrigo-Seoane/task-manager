/**
 * Learner PIN Entry Page
 * Route: /learner/pin
 * Phase 4.1 - Learner Login with 80px buttons
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PinEntryClient } from "@/components/learner/PinEntryClient";

interface PageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function LearnerPinPage({ searchParams }: PageProps) {
  const session = await auth();
  const { id: learnerId } = await searchParams;

  // Must be logged in as tutor to access learner PIN entry
  if (!session || session.user.role !== "tutor") {
    redirect("/tutor/login");
  }

  if (!learnerId) {
    redirect("/learner/select");
  }

  const tutorId = session.user.id;

  // Fetch learner and verify ownership
  const learner = await prisma.learner.findFirst({
    where: {
      id: learnerId,
      tutorId,
    },
    select: {
      id: true,
      displayName: true,
    },
  });

  if (!learner) {
    redirect("/learner/select");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-mist-50)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
      }}
    >
      <PinEntryClient learner={learner} />
    </div>
  );
}
