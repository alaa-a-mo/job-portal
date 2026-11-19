import { redirect } from "react-router-dom";
import { getAuthToken } from "../api/authUtils";

export function requireAuth() {
  const token = getAuthToken();

  if (!token || token === "EXPIRED") {
    return redirect("/auth");
  }

  return null;
}
