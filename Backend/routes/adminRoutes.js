import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";
import {
  adminList,
  adminGet,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const router = Router();

// Every admin route needs a valid Firebase token AND an allow-listed email.
router.use(verifyToken, requireAdmin);

router.get("/posts", asyncHandler(adminList));
router.get("/posts/:id", asyncHandler(adminGet));
router.post("/posts", asyncHandler(createPost));
router.put("/posts/:id", asyncHandler(updatePost));
router.delete("/posts/:id", asyncHandler(deletePost));

export default router;