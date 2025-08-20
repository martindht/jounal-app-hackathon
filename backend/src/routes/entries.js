import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Entry from "../models/Entry.js";

const router = Router();

/** Create */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { content, selfReport, entryDate, prompt = null, sentimentScore = null } = req.body || {};

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }
    const sr = Number(selfReport);
    if (!Number.isFinite(sr) || sr < 1 || sr > 10) {
      return res.status(400).json({ error: "selfReport must be 1..10" });
    }
    const dt = new Date(entryDate || Date.now());
    if (isNaN(dt.getTime())) {
      return res.status(400).json({ error: "entryDate must be ISO date/time" });
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

/** List */
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

    const docs = await Entry.find(q)
      .sort({ entryDate: -1 })
      .limit(Math.min(Number(limit) || 100, 500));

    return res.json({ data: docs });
  } catch (err) {
    console.error("GET /entries error:", err);
    return res.status(500).json({ error: "Failed to fetch entries" });
  }
});

/** Read one */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Entry.findOne({ _id: req.params.id, uid: req.user.uid });
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ data: doc });
  } catch (_err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

/** Update (owner-only) */
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.content === "string" && req.body.content.trim()) {
      updates.content = req.body.content.trim();
    }
    if (req.body.selfReport != null) {
      const sr = Number(req.body.selfReport);
      if (!Number.isFinite(sr) || sr < 1 || sr > 10) {
        return res.status(400).json({ error: "selfReport must be 1..10" });
      }
      updates.selfReport = sr;
    }
    if (req.body.entryDate) {
      const d = new Date(req.body.entryDate);
      if (isNaN(d.getTime())) return res.status(400).json({ error: "entryDate must be ISO date/time" });
      updates.entryDate = d;
    }
    if (req.body.prompt !== undefined) updates.prompt = req.body.prompt || null;
    if (req.body.sentimentScore !== undefined) {
      updates.sentimentScore = typeof req.body.sentimentScore === "number" ? req.body.sentimentScore : null;
    }

    const doc = await Entry.findOneAndUpdate(
      { _id: req.params.id, uid: req.user.uid },
      { $set: updates },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ data: doc });
  } catch (_err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

/** Delete (owner-only) */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const out = await Entry.deleteOne({ _id: req.params.id, uid: req.user.uid });
    if (!out.deletedCount) return res.status(404).json({ error: "Not found" });
    return res.status(204).send();
  } catch (_err) {
    return res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
