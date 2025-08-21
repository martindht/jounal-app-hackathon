import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/v1/me
 * Return the authenticated user's ID + email
 * - `requireAuth` middleware ensures only logged-in users hit this
 */
router.get("/", requireAuth, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});

export default router;

