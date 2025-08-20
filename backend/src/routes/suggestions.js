import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import url from "url";

const router = Router();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "suggestions.json");

let cache = null;
function load() {
  if (!cache) {
    const txt = fs.readFileSync(dataPath, "utf-8");
    cache = JSON.parse(txt);
  }
  return cache;
}

router.get("/", requireAuth, (req, res) => {
  const mood = String((req.query.mood || "")).toLowerCase();
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 10));
  const data = load();

  const pick = data[mood] || data["neutral"];
  // take up to limit items from each bucket if available
  const out = {
    quotes: (pick.quotes || []).slice(0, limit),
    videos: (pick.videos || []).slice(0, Math.min(3, limit)),
    actions: (pick.actions || []).slice(0, limit)
  };
  res.json({ data: out });
});

export default router;
