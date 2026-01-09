/**
 * NextAuth API Route Handler
 * Handles all /api/auth/* requests
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
