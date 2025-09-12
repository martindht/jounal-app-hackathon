import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import fs from "fs";
import path from "path";

const router = Router();

const filePath = path.join(process.cwd(), "resources", "suggestions.json");
let cache = null;
function load() {
  if (!cache) cache = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return cache;
}
function pickOne(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * GET /api/v1/suggestions?mood=sad|neutral|happy
 * -> { data: { quote, video:{title?,url?}, article:{title?,url?} } }
 */
router.get("/", requireAuth, (req, res) => {
  const mood = String(req.query.mood || "neutral");
  const data = load();
  const band = data[mood] || data.neutral || { quotes: [], videos: [], articles: [] };

  const quote = pickOne(band.quotes);
  const video = pickOne(band.videos);
  const article = pickOne(band.articles);

  res.json({ data: { quote: quote || null, video: video || null, article: article || null } });
});

export default router;
