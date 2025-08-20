import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import meRoute from "./routes/me.js";
import entriesRoute from "./routes/entries.js";
import summaryRoute from "./routes/summary.js";
import suggestionsRoute from "./routes/suggestions.js";
import promptsRoute from "./routes/prompts.js";

const app = express();

// CORS
const allowed = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/v1/me", meRoute);
app.use("/api/v1/entries", entriesRoute);
app.use("/api/v1/summary", summaryRoute);
app.use("/api/v1/suggestions", suggestionsRoute);
app.use("/api/v1/prompts", promptsRoute);

// Start
(async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGO_URI");
    await mongoose.connect(uri, { autoIndex: true });
    console.log("MongoDB connected");

    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();

