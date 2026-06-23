import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    if (env.nodeEnv !== 'test') {
      console.log('✅ Connected to MongoDB');
    }
  } catch (error) {
    console.error('❌ Mongo connection error', error.message);
    process.exit(1);
  }
};
