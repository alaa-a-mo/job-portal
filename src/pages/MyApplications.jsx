import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getJob, getMyApplications } from "../api/jobs";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import ApplicationCard from "../components/ApplicationCard";

export default function MyApplications() {
  const userId = localStorage.getItem("userId");

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["my-applications", userId],
    queryFn: () => getMyApplications(userId),
    enabled: !!userId,
  });

  const results = useQueries({
    queries: (data ?? []).map((app) => ({
      queryKey: ["job", app.jobId],
      queryFn: () => getJob(app.jobId),
    })),
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorBlock message={error.message} onRetry={refetch} />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80">
        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          💼
        </div>
        <h3 className="text-base font-semibold text-zinc-900">
          No applications yet
        </h3>
        <p className="text-xs text-zinc-500 mt-1 mb-6">
          Explore open positions and submit your first job application.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-full transition-all shadow-xs cursor-pointer"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track and manage the roles you have applied for across the portal.
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {data.map((app, index) => {
          const result = results[index];

          const isJobAvailable =
            !result.isPending && !result.isError && !!result.data;

          return (
            <ApplicationCard
              key={app.jobId}
              isJobAvailable={isJobAvailable}
              app={app}
              result={result}
            />
          );
        })}
      </div>
    </div>
  );
}
