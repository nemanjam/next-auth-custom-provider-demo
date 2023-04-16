import { PrismaClient } from '@prisma/client';
import { getSqlite } from 'vercel/get-sqlite';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// --------------
// vercel copy sqlite db from Github to /tmp folder hack
let prismaInstance;
if (process.env.NODE_ENV === 'production') {
  const sqlite = await getSqlite();
  const url = `file:${sqlite}`;
  prismaInstance = new PrismaClient({ datasources: { db: { url } } });
} else {
  prismaInstance = new PrismaClient();
}
// --------------

export const prisma = globalForPrisma.prisma || prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
