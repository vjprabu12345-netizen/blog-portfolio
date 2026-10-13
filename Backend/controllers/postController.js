import mongoose from "mongoose";
import Post from "../models/Post.js";
import slugify from "../utils/slugify.js";

const parseTags = (tags) =>
  Array.isArray(tags)
    ? [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(0, 8)
    : [];

async function uniqueSlug(title) {
  const base = slugify(title) || "post";
  let slug = base;
  let n = 1;
  while (await Post.exists({ slug })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

function validate(body) {
  if (!body.title || !body.title.trim()) return "Title is required.";
  if (!body.content || !body.content.trim()) return "Content is required.";
  return null;
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---------- Public ---------- */

export async function listPublished(req, res) {
  const { q, tag } = req.query;
  const filter = { published: true };
  if (tag) filter.tags = String(tag).toLowerCase();
  if (q) {
    const rx = new RegExp(escapeRegex(String(q)), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }];
  }
  const posts = await Post.find(filter).select("-content").sort({ createdAt: -1 });
  res.json({ posts });
}

export async function getBySlug(req, res) {
  const post = await Post.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ error: "Post not found." });
  res.json({ post });
}

/* ---------- Admin ---------- */

export async function adminList(req, res) {
  const posts = await Post.find().select("-content").sort({ createdAt: -1 });
  res.json({ posts });
}

export async function adminGet(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "Post not found." });
  }
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found." });
  res.json({ post });
}

export async function createPost(req, res) {
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ error: problem });

  const post = await Post.create({
    title: req.body.title.trim(),
    slug: await uniqueSlug(req.body.title),
    excerpt: (req.body.excerpt || "").trim(),
    content: req.body.content,
    coverImage: (req.body.coverImage || "").trim(),
    tags: parseTags(req.body.tags),
    published: req.body.published !== false,
    author: { uid: req.user.uid, name: req.user.name, email: req.user.email },
  });

  res.status(201).json({ message: "Post created.", post });
}

export async function updatePost(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "Post not found." });
  }
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ error: problem });

  // The slug is left alone on edit so existing links keep working.
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title.trim(),
      excerpt: (req.body.excerpt || "").trim(),
      content: req.body.content,
      coverImage: (req.body.coverImage || "").trim(),
      tags: parseTags(req.body.tags),
      published: req.body.published !== false,
    },
    { new: true, runValidators: true }
  );

  if (!post) return res.status(404).json({ error: "Post not found." });
  res.json({ message: "Post updated.", post });
}

export async function deletePost(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "Post not found." });
  }
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found." });
  res.json({ message: "Post deleted." });
}