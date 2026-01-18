

// FILE: src/config/prisma.js
// Singleton Prisma Client optimized for Neon serverless PostgreSQL
import { PrismaClient } from '@prisma/client';

const prismaClientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

// Lazy singleton pattern - creates connection only when needed
const prismaClientSingleton = () => {
  return new PrismaClient(prismaClientConfig);
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown handler
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma client disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting Prisma client:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export const checkConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Prisma connection check failed:', error.message);
    return false;
  }
};

export default prisma;