import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

// Lazy initialization - only create Prisma client when DATABASE_URL is set
function getPrismaClient(): PrismaClient | undefined {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['error'],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
