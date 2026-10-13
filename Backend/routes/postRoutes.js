import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { listPublished, getBySlug } from "../controllers/postController.js";

const router = Router();

router.get("/", asyncHandler(listPublished));
router.get("/:slug", asyncHandler(getBySlug));

export default router;