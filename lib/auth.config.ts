/**
 * NextAuth Configuration
 * Dual authentication: Tutor (email/password) + Learner (PIN)
 * Based on docs/USER_FLOWS.md
 */

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const TutorLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userType: z.literal("tutor"),
});

const LearnerLoginSchema = z.object({
  learnerId: z.string().uuid(),
  pin: z.string().length(4).regex(/^\d{4}$/),
  userType: z.literal("learner"),
});

// ============================================================================
// AUTH CONFIG
// ============================================================================

export default {
  providers: [
    Credentials({
      id: "tutor",
      name: "Tutor Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { type: "hidden" },
      },
      async authorize(credentials) {
        const validatedFields = TutorLoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const tutor = await prisma.tutor.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            fullName: true,
            passwordHash: true,
          },
        });

        if (!tutor) {
          return null;
        }

        const passwordsMatch = await compare(password, tutor.passwordHash);

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: tutor.id,
          email: tutor.email,
          name: tutor.fullName,
          role: "tutor" as const,
        };
      },
    }),
    Credentials({
      id: "learner",
      name: "Learner Login",
      credentials: {
        learnerId: { type: "text" },
        pin: { label: "PIN", type: "password" },
        userType: { type: "hidden" },
      },
      async authorize(credentials) {
        const validatedFields = LearnerLoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { learnerId, pin } = validatedFields.data;

        const learner = await prisma.learner.findUnique({
          where: { id: learnerId },
          select: {
            id: true,
            displayName: true,
            pinCode: true,
            tutorId: true,
          },
        });

        if (!learner) {
          return null;
        }

        // Direct PIN comparison (stored as plain text, 4 digits only)
        // Note: For production, consider hashing PINs as well
        if (pin !== learner.pinCode) {
          return null;
        }

        return {
          id: learner.id,
          name: learner.displayName,
          tutorId: learner.tutorId,
          role: "learner" as const,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.role === "learner") {
          token.tutorId = user.tutorId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "tutor" | "learner";
        if (token.role === "learner") {
          session.user.tutorId = token.tutorId as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/tutor/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;
