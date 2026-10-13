import { Router } from "express";
import { verifyToken, isAdminEmail } from "../middleware/auth.js";

const router = Router();

// The frontend calls this after sign-in to learn whether to show the admin link.
router.get("/me", verifyToken, (req, res) => {
  res.json({ email: req.user.email, isAdmin: isAdminEmail(req.user.email) });
});

export default router;