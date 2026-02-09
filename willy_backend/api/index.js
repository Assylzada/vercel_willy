import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import authRoutes from "../routes/auth.routes.js";
import contactRoutes from "../routes/contact.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= Routes =================
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

// ================= Health check =================
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running on Vercel 🚀" });
});

// ================= DB connection for serverless =================
let isDBConnected = false;

export default async function handler(req, res) {
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }
  app(req, res);
}
