import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ Please define the MONGO_URI environment variable');
}

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    return { db: mongoose.connection }; // ✅ Return existing connection
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log('✅ MongoDB connected using Mongoose');
    } else {
      console.log('⚠️ MongoDB connection failed');
    }

    return { db: mongoose.connection }; // ✅ Return the connection explicitly
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
