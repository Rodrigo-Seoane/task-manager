/**
 * Waiting for New Week Page
 * Route: /learner/waiting
 * Phase 4.2 - Shown when no ACTIVE cycle exists
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WaitingClient } from "@/components/learner/WaitingClient";

export default async function LearnerWaitingPage() {
  const session = await auth();

  // Must be logged in as learner
  if (!session || session.user.role !== "learner") {
    redirect("/learner/select");
  }

  const learnerId = session.user.id;

  // Fetch learner data
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    select: {
      id: true,
      displayName: true,
    },
  });

  if (!learner) {
    redirect("/learner/select");
  }

  // Check for active cycle (redirect if one exists)
  const activeCycle = await prisma.weeklyCycle.findFirst({
    where: {
      learnerId,
      status: "ACTIVE",
    },
  });

  if (activeCycle) {
    redirect("/learner/dashboard");
  }

  return <WaitingClient learnerName={learner.displayName} />;
}
