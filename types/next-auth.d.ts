/**
 * NextAuth Type Extensions
 * Extends default NextAuth types to include role-based authentication
 */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "tutor" | "learner";
    tutorId?: string; // Only for learners
  }

  interface Session {
    user: {
      id: string;
      role: "tutor" | "learner";
      tutorId?: string; // Only for learners
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "tutor" | "learner";
    tutorId?: string; // Only for learners
  }
}
