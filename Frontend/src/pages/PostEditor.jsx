import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client, { errorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const empty = { title: "", excerpt: "", coverImage: "", tags: "", content: "", published: true };

export default function PostEditor() {
  const { id } = useParams(); // present when editing
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(Boolean(id));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    client
      .get(`/admin/posts/${id}`)
      .then(({ data }) => {
        const p = data.post;
        setForm({ ...p, tags: p.tags.join(", ") });
      })
      .catch((err) => setError(errorMessage(err, "Couldn't load this post.")))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) {
      return setError("Title and content are required.");
    }
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      coverImage: form.coverImage,
      content: form.content,
      published: form.published,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setBusy(true);
    try {
      if (id) await client.put(`/admin/posts/${id}`, payload);
      else await client.post("/admin/posts", payload);
      notify(id ? "Post updated." : "Post created.");
      navigate("/admin");
    } catch (err) {
      setError(errorMessage(err, "Couldn't save the post."));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="page-status">Loading…</p>;

  return (
    <div className="container section editor">
      <h1>{id ? "Edit post" : "New post"}</h1>
      <form className="panel" onSubmit={submit} noValidate>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Title
          <input className="input" name="title" value={form.title} onChange={set} />
        </label>
        <label>
          Short summary
          <input className="input" name="excerpt" maxLength={300} value={form.excerpt} onChange={set} />
        </label>
        <label>
          Cover image URL (optional)
          <input className="input" name="coverImage" value={form.coverImage} onChange={set} placeholder="https://…" />
        </label>
        <label>
          Tags (comma separated)
          <input className="input" name="tags" value={form.tags} onChange={set} placeholder="react, firebase" />
        </label>
        <label>
          Content
          <textarea className="input" name="content" rows={12} value={form.content} onChange={set} />
          <small>Leave a blank line between paragraphs. Start a line with "## " for a heading.</small>
        </label>
        <label className="check">
          <input type="checkbox" name="published" checked={form.published} onChange={set} />
          Published (uncheck to save as a draft)
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : id ? "Save changes" : "Create post"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}