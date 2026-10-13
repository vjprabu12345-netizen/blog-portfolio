// Turns Firebase's error codes into messages a person can act on.
const messages = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/weak-password": "Password is too weak — use at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

export default function authErrorMessage(error) {
  return messages[error?.code] || "Something went wrong. Please try again.";
}