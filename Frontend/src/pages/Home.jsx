import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import PostCard from "../components/PostCard";
import site from "../config/site";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/posts")
      .then((res) => setPosts(res.data.posts.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">{site.role}</p>
          <h1>Hi, I'm {site.name}.</h1>
          <p className="hero-text">{site.tagline}</p>
          <div className="hero-actions">
            <Link to="/blog" className="btn btn-primary">
              Read the blog
            </Link>
            {site.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {l.label}
              </a>
            ))}
          </div>
          <div className="tag-row skills">
            {site.skills.map((s) => (
              <span key={s} className="tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Latest writing</h2>
          <Link to="/blog">All posts →</Link>
        </div>
        {loading && <p className="page-status">Loading…</p>}
        {!loading && posts.length === 0 && <p className="page-status">No posts yet.</p>}
        <div className="grid">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}