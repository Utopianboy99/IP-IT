import { getAuth } from "firebase-admin/auth";

async function getToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(); // JWT
  }
  return null;
}
