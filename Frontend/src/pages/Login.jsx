import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import authErrorMessage from "../utils/authErrors";

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      return setError("Enter your email and password.");
    }
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      notify("Welcome back!");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container auth">
      <form className="panel" onSubmit={submit} noValidate>
        <h1>Log in</h1>
        {error && <p className="alert alert-error">{error}</p>}
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
            autoComplete="current-password"
            value={form.password}
            onChange={set}
          />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
        <p className="auth-alt">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}