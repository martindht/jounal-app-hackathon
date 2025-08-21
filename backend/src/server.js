// Purpose: Boot API, wire JSON parsing, mount routes, connect Mongo, and start listening
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// route modules
import meRoute from "./routes/me.js";
import entriesRoute from "./routes/entries.js";
import summaryRoute from "./routes/summary.js";
import suggestionsRoute from "./routes/suggestions.js";
import promptsRoute from "./routes/prompts.js";

const app = express();

/* --------- CORS --------- */
app.use(cors());

/* --------- Body parsing --------- */
// JSON parsing
app.use(express.json({ limit: "1mb" }));

/* --------- Routes --------- */
app.use("/api/v1/me", meRoute);
app.use("/api/v1/entries", entriesRoute);
app.use("/api/v1/summary", summaryRoute);
app.use("/api/v1/suggestions", suggestionsRoute);
app.use("/api/v1/prompts", promptsRoute);

/* --------- Startup --------- */
(async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGO_URI");
    // connect to Mongo
    await mongoose.connect(uri, { autoIndex: true });
    const port = Number(process.env.PORT) || 5000;
    app.listen(port);
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();

