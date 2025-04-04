import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.mongoUrl;

export async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Not connected:", error);
  }
}
