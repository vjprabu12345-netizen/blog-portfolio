// Run once with: npm run seed
// Adds a few starter posts so the blog isn't empty. Pass --reset to wipe first.
import "dotenv/config";
import mongoose from "mongoose";
import Post from "./models/Post.js";
import slugify from "./utils/slugify.js";

const samples = [
  {
    title: "Shipping my first full-stack app",
    excerpt: "What I learned wiring React, Express and MongoDB together for the first time.",
    tags: ["mern", "learning"],
    content:
      "## Why I built it\n\nI wanted one project that touched every layer: a React UI, an Express API and a real database.\n\nThe biggest surprise was how much of the work is the seams between the pieces, not the pieces themselves.\n\n## What I'd do differently\n\nStart with the data model. Everything else gets easier once the shape of a post is settled.",
  },
  {
    title: "Why I picked Firebase for authentication",
    excerpt: "Rolling your own login is a trap. Here's how Firebase Auth fits next to a custom API.",
    tags: ["firebase", "auth"],
    content:
      "## The idea\n\nFirebase handles sign-up, login and password storage. My Express API never sees a password; it only checks the ID token Firebase issues.\n\n## Admin access\n\nThe API keeps an allow-list of admin emails, so being logged in is not the same as being an admin.",
  },
  {
    title: "Notes on designing a tidy blog schema",
    excerpt: "Slugs, tags and a published flag go a long way.",
    tags: ["mongodb", "design"],
    content:
      "A post needs a title, a slug for friendly URLs, some content and a published flag so drafts stay private.\n\nTags are just an array of strings. Simple, searchable and easy to extend later.",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  if (process.argv.includes("--reset")) {
    await Post.deleteMany({});
    console.log("Cleared existing posts.");
  }

  if ((await Post.countDocuments()) > 0) {
    console.log("Posts already exist — skipping. Use --reset to start over.");
  } else {
    await Post.insertMany(
      samples.map((p) => ({
        ...p,
        slug: slugify(p.title),
        published: true,
        author: { name: "Site Owner", email: "", uid: "" },
      }))
    );
    console.log(`Inserted ${samples.length} sample posts.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});