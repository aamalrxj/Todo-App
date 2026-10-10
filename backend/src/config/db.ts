import mongoose from 'mongoose';

// Connects to MongoDB using the URI from the .env file.
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in .env');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};