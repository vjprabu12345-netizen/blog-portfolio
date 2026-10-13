import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import site from "../config/site";

export default function Navbar() {
  const { profile, isAdmin, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      notify("You've been logged out.");
      navigate("/");
    } catch {
      notify("Couldn't log out. Please try again.", "error");
    }
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          {site.name}
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/blog" className={linkClass}>
            Blog
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
          {profile ? (
            <>
              <span className="nav-user" title={profile.email}>
                {profile.name || profile.email}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}