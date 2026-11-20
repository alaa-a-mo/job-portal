import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import MainNav from "../components/MainNav";

export default function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <MainNav />
      <div className="text-center py-16 px-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {is404 ? "404" : "Something went wrong"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {is404 ? "Page not found" : "Please try again."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700 shadow-xs"
        >
          Back to jobs
        </Link>
      </div>
    </div>
  );
}
