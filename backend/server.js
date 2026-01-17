import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import examRoutes from "./routes/exam.routes.js";
import responseRoutes from "./routes/response.routes.js";

/* ===== ENV SETUP ===== */
dotenv.config();

/* ===== DATABASE CONNECTION ===== */
connectDB();

/* ===== APP INIT ===== */
const app = express();

/* ===== GLOBAL MIDDLEWARE ===== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", // student frontend
      "http://localhost:3000", // admin frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===== API ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/responses", responseRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running 🚀",
    time: new Date().toISOString(),
  });
});

/* ===== 404 HANDLER ===== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ===== GLOBAL ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* ===== SERVER START ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
