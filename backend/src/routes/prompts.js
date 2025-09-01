import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Optional prompts to give the user ideas
const PROMPTS = [
  "What’s one thing you learned today?",
  "Describe a moment that felt meaningful.",
  "What drained your energy? What restored it?",
  "What would help 'future you' tomorrow?",
  "Name one small win you’re proud of.",
  "What emotion has been strongest today?",
  "What’s been on your mind lately?",
  "How much do your current goals reflect your desires vs someone else’s?",
  "In what ways are you currently self-sabotaging or holding yourself back?",
  "Write about a mistake that taught you something about yourself.",
  "Write about an aspect of your personality that you appreciate in other people as well."
];

// GET /api/v1/prompts/daily – rotate 3 prompts by day
router.get("/daily", requireAuth, (_req, res) => {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const picks = [];
  for (let i = 0; i < 3; i++) {
    const idx = (day + i * 97) % PROMPTS.length;
    picks.push(PROMPTS[idx]);
  }
  res.json({ data: picks });
});

export default router;
