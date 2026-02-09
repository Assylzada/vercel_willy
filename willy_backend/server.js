import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import subRoutes from "./src/routes/sub.routes.js";

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
