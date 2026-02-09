import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import orderRoutes from "../routes/order.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("🍫 Willy Wonka API works!");
});

export default async (req, res) => {
  await connectDB();
  return app(req, res);
};
