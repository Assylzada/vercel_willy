import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import authRoutes from "../routes/auth.routes.js";
import contactRoutes from "../routes/contact.routes.js";

dotenv.config();

// Сразу подключаемся к БД (Vercel кэширует соединение)
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running on Vercel 🚀" });
});

// ГЛАВНОЕ: Экспортируем именно app
export default app;