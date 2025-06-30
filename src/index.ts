

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./api/auth";
import scheduleRoutes from "./api/schedules";

dotenv.config();

const app = express();

app.use(
  cors({
  origin: [
   // "http://localhost:3000", 
    "https://timer-frontend-iota.vercel.app"
],
    credentials: true,
  })
);


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Mongo error:", err));
