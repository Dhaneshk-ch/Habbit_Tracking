// ─────────────────────────────────────────────────────────────
//  FlowZen Backend  —  Express + MongoDB + JWT + Gemini AI
//  server.js  —  Entry point
// ─────────────────────────────────────────────────────────────
import "dotenv/config";
import express  from "express";
import cors     from "cors";
import { connectDB } from "./config/db.js";

// Routes
import authRoutes   from "./routes/auth.js";
import habitRoutes  from "./routes/habits.js";
import logRoutes    from "./routes/logs.js";
import aiRoutes     from "./routes/ai.js";

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", app: "FlowZen", time: new Date().toISOString() })
);

// ── API Routes ──────────────────────────────────────────────
app.use("/api/auth",   authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs",   logRoutes);
app.use("/api/ai",     aiRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` })
);

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error." });
});

// ── Start ────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  FlowZen backend running on http://localhost:${PORT}`);
    console.log(`📡  Health: http://localhost:${PORT}/api/health`);
  });
});
