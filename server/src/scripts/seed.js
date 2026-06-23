import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { EmissionEntry } from '../models/EmissionEntry.js';
import { Goal } from '../models/Goal.js';

const seed = async () => {
  await connectDb();
  await Promise.all([User.deleteMany({}), EmissionEntry.deleteMany({}), Goal.deleteMany({})]);

  const password = await bcrypt.hash('Password123!', env.saltingRounds);
  const user = await User.create({
    name: 'Eco Test',
    email: 'test@ecotrackify.com',
    password,
    isVerified: true
  });

  await EmissionEntry.create([
    {
      userId: user.id,
      category: 'transportation',
      subCategory: 'Commute',
      quantity: 15,
      unit: 'km',
      emissionFactor: 0.12,
      calculatedCO2e: 1.8,
      entryDate: new Date()
    },
    {
      userId: user.id,
      category: 'energy',
      subCategory: 'Home electricity',
      quantity: 40,
      unit: 'kwh',
      emissionFactor: 0.4,
      calculatedCO2e: 16,
      entryDate: new Date()
    }
  ]);

  await Goal.create({
    userId: user.id,
    title: 'Reduce energy consumption by 15%',
    description: 'Swap to LED bulbs and monitor daily usage',
    targetValue: 15,
    unit: '%',
    baselineValue: 0,
    currentValue: 5,
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    status: 'in_progress'
  });

  console.log('✅ Seed data inserted');
  process.exit(0);
};

seed().catch((error) => {
  console.error('❌ Seed error', error);
  process.exit(1);
});
