import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subRoutes from "./routes/sub.routes.js";

const app = express();

/* ================== Middleware ================== */
app.use(cors());
app.use(express.json());

/* ================== MongoDB ================== */
await connectDB();

/* ================== Routes ================== */
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subRoutes);

/* ================== Error handler ================== */
app.use(errorHandler);

/* ================== EXPORT (ВАЖНО) ================== */
export default app;
