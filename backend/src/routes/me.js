import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});

export default router;

