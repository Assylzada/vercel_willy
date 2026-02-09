import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import authRoutes from "../routes/auth.routes.js";
import contactRoutes from "../routes/contact.routes.js";
import ticketRoutes from "../routes/ticket.routes.js";
import orderRoutes from "../routes/order.routes.js";
import subRoutes from "../routes/sub.routes.js";

import errorHandler from "../middleware/error.middleware.js";

dotenv.config();

const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ================= Routes =================
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subRoutes);

// ================= Error handler =================
app.use(errorHandler);

// ================= Serverless handler =================
let isDBConnected = false;

export default async function handler(req, res) {
  // Ensure MongoDB connection
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }

  // Pass request to Express
  app(req, res);
}
