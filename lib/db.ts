import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect('mongodb+srv://bakerboonsa_db_user:V5L3OBk6IJXvGjvx@cluster0.kxvs8rg.mongodb.net/SCORE?authSource=admin&appName=Cluster0', {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    console.log('Connected to MongoDB successfully');
  } catch (error: any) {
    console.error('MongoDB connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      topologyVersion: error.topologyVersion,
    });
    throw error;
  }
};
