import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash a default password for demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user:', admin.email);

  // 2. Create Farmer Users
  const farmer1 = await prisma.user.create({
    data: {
      name: 'Farmer User',
      email: 'farmer@example.com',
      password: hashedPassword,
      role: 'FARMER'
    }
  });

  const farmer2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@farmer.com',
      password: hashedPassword,
      role: 'FARMER'
    }
  });

  const farmer3 = await prisma.user.create({
    data: {
      name: 'Amit Patel',
      email: 'amit@farmer.com',
      password: hashedPassword,
      role: 'FARMER'
    }
  });

  console.log('✅ Created 3 farmer users');

  // 3. Create Milk Collections for Farmers
  await prisma.milkCollection.createMany({
    data: [
      // Rajesh's collections
      { userId: farmer1.id, quantity: 15.5, fatPercentage: 4.2, snf: 8.5, isBilled: true },
      { userId: farmer1.id, quantity: 18.0, fatPercentage: 4.5, snf: 8.7, isBilled: true },
      { userId: farmer1.id, quantity: 16.5, fatPercentage: 4.3, snf: 8.6, isBilled: false },
      
      // Priya's collections
      { userId: farmer2.id, quantity: 12.0, fatPercentage: 3.8, snf: 8.4, isBilled: true },
      { userId: farmer2.id, quantity: 14.5, fatPercentage: 4.0, snf: 8.5, isBilled: false },
      
      // Amit's collections
      { userId: farmer3.id, quantity: 20.0, fatPercentage: 4.6, snf: 8.8, isBilled: true },
      { userId: farmer3.id, quantity: 22.5, fatPercentage: 4.7, snf: 8.9, isBilled: true },
      { userId: farmer3.id, quantity: 19.0, fatPercentage: 4.5, snf: 8.7, isBilled: false }
    ]
  });
  console.log('✅ Created milk collections for farmers');

  // 4. Create Payments for Farmers
  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  await prisma.payment.createMany({
    data: [
      // Rajesh's payments
      {
        userId: farmer1.id,
        amount: 4500.00,
        periodStartDate: new Date('2025-10-01'),
        periodEndDate: new Date('2025-10-15'),
        status: 'PAID'
      },
      {
        userId: farmer1.id,
        amount: 5200.00,
        periodStartDate: new Date('2025-10-16'),
        periodEndDate: new Date('2025-10-31'),
        status: 'PAID'
      },
      {
        userId: farmer1.id,
        amount: 3800.00,
        periodStartDate: new Date('2025-11-01'),
        periodEndDate: new Date('2025-11-10'),
        status: 'PENDING'
      },

      // Priya's payments
      {
        userId: farmer2.id,
        amount: 3200.00,
        periodStartDate: new Date('2025-10-01'),
        periodEndDate: new Date('2025-10-15'),
        status: 'PAID'
      },
      {
        userId: farmer2.id,
        amount: 3500.00,
        periodStartDate: new Date('2025-10-16'),
        periodEndDate: new Date('2025-10-31'),
        status: 'PENDING'
      },

      // Amit's payments
      {
        userId: farmer3.id,
        amount: 6000.00,
        periodStartDate: new Date('2025-10-01'),
        periodEndDate: new Date('2025-10-15'),
        status: 'PAID'
      },
      {
        userId: farmer3.id,
        amount: 6500.00,
        periodStartDate: new Date('2025-10-16'),
        periodEndDate: new Date('2025-10-31'),
        status: 'PAID'
      }
    ]
  });
  console.log('✅ Created payments for farmers');

  // 5. Create Expenses for Admin
  await prisma.expense.createMany({
    data: [
      {
        userId: admin.id,
        description: 'Monthly electricity bill',
        amount: 2500.00,
        category: 'Utilities',
        date: new Date('2025-10-05')
      },
      {
        userId: admin.id,
        description: 'Equipment maintenance',
        amount: 5000.00,
        category: 'Maintenance',
        date: new Date('2025-10-12')
      },
      {
        userId: admin.id,
        description: 'Staff salaries',
        amount: 35000.00,
        category: 'Payroll',
        date: new Date('2025-10-25')
      },
      {
        userId: admin.id,
        description: 'Transportation costs',
        amount: 3200.00,
        category: 'Logistics',
        date: new Date('2025-11-02')
      },
      {
        userId: admin.id,
        description: 'Office supplies',
        amount: 1500.00,
        category: 'Supplies',
        date: new Date('2025-11-08')
      }
    ]
  });
  console.log('✅ Created expenses for admin');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
