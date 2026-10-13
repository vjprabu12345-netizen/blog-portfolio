import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "", trim: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    author: {
      uid: { type: String, default: "" },
      name: { type: String, default: "" },
      email: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);