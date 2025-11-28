// FILE: src/config/prisma.js
// Singleton Prisma Client to avoid multiple instances
// Configured for Neon serverless PostgreSQL

import { PrismaClient } from '@prisma/client';

let prisma;

const prismaClientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientConfig);
} else {
  // In development, use a global variable to prevent multiple instances during hot-reload
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaClientConfig);
  }
  prisma = global.prisma;
}

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

// Handle process termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

// Connection health check helper
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
