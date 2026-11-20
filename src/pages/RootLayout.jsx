import { Outlet, useRevalidator, useRouteLoaderData } from "react-router-dom";
import MainNav from "../components/MainNav";
import { useEffect } from "react";
import { getTokenDuration, logout } from "../api/authUtils";
import NotificationToast from "../components/UI/NotificationToast";

export default function RootLayout() {
  const token = useRouteLoaderData("root");
  const { revalidate } = useRevalidator();

  useEffect(() => {
    if (!token || token === "EXPIRED") {
      return;
    }
    const duration = getTokenDuration();
    if (!Number.isFinite(duration) || duration <= 0) {
      logout();
      revalidate();
      return;
    }
    const timeout = setTimeout(() => {
      logout();
      revalidate();
    }, duration);

    return () => {
      clearTimeout(timeout);
    };
  }, [token, revalidate]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <MainNav />
      <NotificationToast />
      <Outlet />
    </div>
  );
}
