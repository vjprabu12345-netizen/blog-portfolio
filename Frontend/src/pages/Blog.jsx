import React, { useEffect, useMemo, useState } from "react";
import client, { errorMessage } from "../api/client";
import PostCard from "../components/PostCard";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    client
      .get("/posts")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => setError(errorMessage(err, "Couldn't load posts.")))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);

  const visible = posts.filter((p) => {
    const matchesTag = !tag || p.tags.includes(tag);
    const text = `${p.title} ${p.excerpt}`.toLowerCase();
    return matchesTag && text.includes(query.trim().toLowerCase());
  });

  return (
    <div className="container section">
      <h1>Blog</h1>
      <input
        className="input search"
        type="search"
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {tags.length > 0 && (
        <div className="tag-row filters">
          <button type="button" className={`tag ${!tag ? "tag-on" : ""}`} onClick={() => setTag("")}>
            all
          </button>
          {tags.map((t) => (
            <button
              type="button"
              key={t}
              className={`tag ${tag === t ? "tag-on" : ""}`}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="page-status">Loading…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && visible.length === 0 && <p className="page-status">No posts found.</p>}

      <div className="grid">
        {visible.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}