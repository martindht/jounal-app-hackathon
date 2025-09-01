import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Entry from "../models/Entry.js";

const router = Router();

// quick ping to confirm the mount works
router.get("/ping", (_req, res) => res.json({ ok: true }));

function matchFor(uid, from, to) {
  const q = { uid };
  if (from || to) {
    q.entryDate = {};
    if (from) { const d = new Date(from); if (!isNaN(d)) q.entryDate.$gte = d; }
    if (to)   { const d = new Date(to);   if (!isNaN(d)) q.entryDate.$lte = d; }
  }
  return q;
}

async function summarize(unit, req, res) {
  try {
    const { from, to } = req.query || {};
    const pipeline = [
      { $match: matchFor(req.user.uid, from, to) },
      {
        $group: {
          _id: { $dateTrunc: { date: "$entryDate", unit, timezone: "UTC" } },
          count: { $sum: 1 },
          avgSelfReport: { $avg: "$selfReport" },
        },
      },
      { $project: { _id: 0, period: "$_id", count: 1, avgSelfReport: { $round: ["$avgSelfReport", 2] } } },
      { $sort: { period: 1 } },
    ];
    const rows = await Entry.aggregate(pipeline);
    res.json({ data: rows });
  } catch (e) {
    console.error(`SUMMARY ${unit} error:`, e);
    res.status(500).json({ error: "Failed to summarize" });
  }
}

router.get("/weekly",  requireAuth, (req, res) => summarize("week",  req, res));
router.get("/monthly", requireAuth, (req, res) => summarize("month", req, res));

export default router;
