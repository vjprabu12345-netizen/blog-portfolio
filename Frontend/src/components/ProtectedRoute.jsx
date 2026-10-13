import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap a page in this to require login. Add adminOnly to also require admin rights.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { profile, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="page-status">Checking your session…</p>;

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="container denied">
        <h1>Access denied</h1>
        <p>Your account doesn't have permission to open the admin panel.</p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  return children;
}