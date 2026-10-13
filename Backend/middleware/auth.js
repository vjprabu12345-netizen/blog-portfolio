import admin from "../config/firebase.js";

const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) => adminEmails().includes(String(email || "").toLowerCase());

// Verifies the Firebase ID token the frontend sends as "Authorization: Bearer <token>".
export async function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Please sign in to continue." });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || "", name: decoded.name || "" };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
}

// Must run after verifyToken. The allowlist lives on the server so the
// browser can never grant itself admin rights.
export function requireAdmin(req, res, next) {
  if (!isAdminEmail(req.user?.email)) {
    return res.status(403).json({ error: "You don't have permission to access the admin panel." });
  }
  next();
}