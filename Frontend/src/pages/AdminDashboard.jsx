import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client, { errorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

export default function AdminDashboard() {
  const { notify } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/admin/posts")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => setError(errorMessage(err, "Couldn't load posts.")))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    try {
      await client.delete(`/admin/posts/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      notify("Post deleted.");
    } catch (err) {
      notify(errorMessage(err, "Couldn't delete the post."), "error");
    }
  };

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Admin panel</h1>
        <Link to="/admin/new" className="btn btn-primary">
          + New post
        </Link>
      </div>

      {loading && <p className="page-status">Loading…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p className="page-status">No posts yet. Add your first one.</p>}

      {posts.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>
                    <span className={`badge ${p.published ? "badge-on" : ""}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{formatDate(p.createdAt)}</td>
                  <td className="actions">
                    {p.published && (
                      <Link to={`/blog/${p.slug}`} className="btn btn-ghost btn-sm">
                        View
                      </Link>
                    )}
                    <Link to={`/admin/edit/${p._id}`} className="btn btn-ghost btn-sm">
                      Edit
                    </Link>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}