import queryClient from "./queryClient";
import { API_KEY } from "./database";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");

  const expirationTime = Number(storedExpirationDate);
  const now = Date.now();

  return expirationTime - now;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (!Number.isFinite(tokenDuration) || tokenDuration <= 0) {
    return "EXPIRED";
  }

  return token;
}

export async function verifyToken(token) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token }),
    },
  );

  if (!response.ok) {
    return false;
  }

  return true;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiration");
  localStorage.removeItem("email");

  queryClient.clear();
}
