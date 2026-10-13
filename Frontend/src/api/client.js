import axios from "axios";
import { auth } from "../firebase";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Attach the current user's Firebase ID token (refreshed automatically by
// the SDK) so the backend can verify who is calling.
client.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const errorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.error || fallback;

export default client;