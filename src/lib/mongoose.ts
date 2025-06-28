import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // 👈 MUST come before using process.env

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI);
};

export default dbConnect;


