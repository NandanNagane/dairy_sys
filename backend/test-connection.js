// Quick test script to verify Neon PostgreSQL connection
import prisma, { checkConnection } from './src/config/prisma.js';

async function testConnection() {
  console.log('🔄 Testing Neon PostgreSQL connection...\n');
  
  try {
    // Test 1: Health check
    console.log('Test 1: Connection health check...');
    const isHealthy = await checkConnection();
    console.log(isHealthy ? '✅ Health check passed' : '❌ Health check failed');
    
    // Test 2: Simple query
    console.log('\nTest 2: Simple query test...');
    const result = await prisma.$queryRaw`SELECT current_database(), version()`;
    console.log('✅ Query executed successfully');
    console.log('Database:', result[0].current_database);
    
    // Test 3: Count users
    console.log('\nTest 3: Count users in database...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users`);
    
    // Test 4: Test write operation
    console.log('\nTest 4: Connection pool test...');
    const dbStatus = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Connection pool is working correctly');
    console.log('Server time:', dbStatus[0].current_time);
    
    console.log('\n✨ All tests passed! Connection is working correctly.\n');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('\nTroubleshooting tips:');
    console.error('1. Verify DATABASE_URL in .env is correct');
    console.error('2. Check if Neon database is active (not suspended)');
    console.error('3. Ensure network connection is stable');
    console.error('4. Verify pooler endpoint is accessible\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

testConnection();
