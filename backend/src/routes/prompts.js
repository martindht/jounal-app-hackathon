import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const PROMPTS = [
  "What’s one thing you learned today?",
  "Describe a moment that felt meaningful.",
  "What drained your energy? What restored it?",
  "What would help 'future you' tomorrow?",
  "Name one small win you’re proud of."
];

router.get("/daily", requireAuth, (_req, res) => {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  // rotate 3 prompts deterministically
  const picks = [];
  for (let i = 0; i < 3; i++) {
    const idx = (day + i * 97) % PROMPTS.length;
    picks.push(PROMPTS[idx]);
  }
  res.json({ data: picks });
});

export default router;
