import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";

export default function PostCard({ post }) {
  return (
    <article className="card">
      {post.coverImage && (
        <Link to={`/blog/${post.slug}`} className="card-cover">
          <img src={post.coverImage} alt="" loading="lazy" />
        </Link>
      )}
      <div className="card-body">
        <p className="card-date">{formatDate(post.createdAt)}</p>
        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="card-excerpt">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <div className="tag-row">
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}