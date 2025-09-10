// src/utils/auth.js
export function getAuthHeader() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const { email, password } = JSON.parse(userStr);
    if (!email || !password) return null;

    const encoded = btoa(`${email}:${password}`);
    return `Basic ${encoded}`;
  } catch (err) {
    console.error("Invalid user data in localStorage:", err);
    return null;
  }
}
