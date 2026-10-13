import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import authErrorMessage from "../utils/authErrors";

export default function Signup() {
  const { signup } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");

    setBusy(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password);
      notify("Account created. Welcome aboard!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container auth">
      <form className="panel" onSubmit={submit} noValidate>
        <h1>Sign up</h1>
        {error && <p className="alert alert-error">{error}</p>}
        <label>
          Name
          <input className="input" name="name" autoComplete="name" value={form.name} onChange={set} />
        </label>
        <label>
          Email
          <input className="input" name="email" type="email" autoComplete="email" value={form.email} onChange={set} />
        </label>
        <label>
          Password
          <input
            className="input"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set}
          />
        </label>
        <label>
          Confirm password
          <input
            className="input"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set}
          />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}