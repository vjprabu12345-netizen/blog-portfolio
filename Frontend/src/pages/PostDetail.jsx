import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../api/client";
import { formatDate, readingTime } from "../utils/format";

// Plain-text renderer: blank line = new paragraph, "## " = heading.
// No HTML is ever injected, so post content can't run scripts.
function Content({ text }) {
  return text.split(/\n{2,}/).map((block, i) =>
    block.startsWith("## ") ? (
      <h2 key={i}>{block.slice(3)}</h2>
    ) : (
      <p key={i}>{block}</p>
    )
  );
}

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPost(null);
    setNotFound(false);
    client
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data.post))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="container denied">
        <h1>Post not found</h1>
        <Link to="/blog" className="btn btn-primary">
          Back to blog
        </Link>
      </div>
    );
  }
  if (!post) return <p className="page-status">Loading…</p>;

  return (
    <article className="container post">
      <Link to="/blog" className="back">
        ← All posts
      </Link>
      <h1>{post.title}</h1>
      <p className="post-meta">
        {formatDate(post.createdAt)} · {readingTime(post.content)} min read
        {post.author?.name && ` · ${post.author.name}`}
      </p>
      {post.coverImage && <img className="post-cover" src={post.coverImage} alt="" />}
      <div className="prose">
        <Content text={post.content} />
      </div>
      <div className="tag-row">
        {post.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}