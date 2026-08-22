// Shared Prisma client instance for the monorepo.
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __edmPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__edmPrisma ??
  new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") global.__edmPrisma = prisma;

export * from "@prisma/client";
