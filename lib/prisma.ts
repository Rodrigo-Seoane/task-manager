/**
 * Prisma Client Instance with Accelerate
 *
 * Singleton pattern to prevent multiple instances in development
 * Using Prisma Accelerate for connection pooling and caching
 * See: https://www.prisma.io/docs/accelerate
 */

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Get the DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined in environment variables. Please check your .env file."
  );
}

function createPrismaClient() {
  return new PrismaClient({
    accelerateUrl: databaseUrl,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends(withAccelerate());
}

// Create Prisma Client with Accelerate extension
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
