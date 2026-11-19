import { redirect } from "react-router-dom";
import { signup, login } from "../api/auth";
import { getAuthToken } from "../api/authUtils";

function storedUserSession(data) {
  const expirationTime = new Date().getTime() + Number(data.expiresIn) * 1000;
  localStorage.setItem("token", data.idToken);
  localStorage.setItem("userId", data.localId);
  localStorage.setItem("email", data.email);
  localStorage.setItem("expiration", expirationTime);
}

export async function authAction({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  if (mode !== "login" && mode !== "signup") {
    throw new Response("Invalid mode", { status: 422 });
  }

  const MIN_PASSWORD_LENGTH = 6;

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (mode === "signup") {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return {
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      };
    }
    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }
    try {
      const data = await signup(email, password);
      storedUserSession(data);

      return redirect("/");
    } catch (error) {
      return { error: error.message };
    }
  }

  if (mode === "login") {
    try {
      const data = await login(email, password);
      storedUserSession(data);

      return redirect("/");
    } catch (error) {
      return { error: error.message };
    }
  }

  return { message: "Validation passed." };
}

export function authLoader() {
  const tokenState = getAuthToken();
  if (tokenState === null || tokenState === "EXPIRED") {
    return;
  } else {
    return redirect("/");
  }
}
