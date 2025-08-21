import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Entry from "../models/Entry.js";

const router = Router();

/**
 * POST /api/v1/entries
 * Body: { content: string, selfReport: number, entryDate: ISO, prompt? , sentimentScore? }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { content, selfReport, entryDate, prompt = null, sentimentScore = null } = req.body || {};

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }

    // Coerce and clamp mood to 1..10 in case someone bypasses the UI
    let sr = Number(selfReport);
    if (!Number.isFinite(sr)) sr = 5;
    sr = Math.max(1, Math.min(10, sr));

    // Coerce date; fallback to now if invalid
    const dt = new Date(entryDate || Date.now());
    if (isNaN(dt.getTime())) {
      dt.setTime(Date.now());
    }

    const doc = await Entry.create({
      uid: req.user.uid,
      content: content.trim(),
      selfReport: sr,
      entryDate: dt,
      prompt,
      sentimentScore: typeof sentimentScore === "number" ? sentimentScore : null,
    });

    return res.status(201).json({ data: doc });
  } catch (err) {
    console.error("POST /entries error:", err);
    return res.status(500).json({ error: "Failed to create entry" });
  }
});

/**
 * GET /api/v1/entries
 * Query: from?, to?, limit?
 * Returns newest → oldest.
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { from, to, limit = 100 } = req.query || {};
    const q = { uid: req.user.uid };

    if (from || to) {
      q.entryDate = {};
      if (from) {
        const d = new Date(from);
        if (!isNaN(d.getTime())) q.entryDate.$gte = d;
      }
      if (to) {
        const d = new Date(to);
        if (!isNaN(d.getTime())) q.entryDate.$lte = d;
      }
    }

    const lim = Math.min(Math.max(Number(limit) || 100, 1), 500);

    const docs = await Entry.find(q)
      .sort({ entryDate: -1 })
      .limit(lim);

    return res.json({ data: docs });
  } catch (err) {
    console.error("GET /entries error:", err);
    return res.status(500).json({ error: "Failed to fetch entries" });
  }
});

/**
 * (Optional) GET /api/v1/entries/:id
 * Leaving this in for now in case we want to display one at a time
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Entry.findOne({ _id: req.params.id, uid: req.user.uid });
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ data: doc });
  } catch (_err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
