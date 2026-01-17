import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import examRoutes from "./routes/exam.routes.js";
import responseRoutes from "./routes/response.routes.js";

/* ================= ENV ================= */
dotenv.config();

/* ================= DB ================= */
connectDB();

/* ================= APP ================= */
const app = express();

/* ================= 🔥 CORS (EXPRESS v5 SAFE) =================
   - Allows all origins (dev friendly)
   - Handles OPTIONS preflight correctly
   - Works on Render + Netlify + localhost
=============================================================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED for Express v5 (regex wildcard)
app.options(/.*/, cors());

/* ================= BODY PARSERS ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/responses", responseRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running 🚀",
    time: new Date().toISOString(),
  });
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
