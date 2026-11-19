import { useState } from "react";
import { Link } from "react-router-dom";

const statusColors = {
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  pending: "bg-amber-50 text-amber-700 border-amber-200/80",
  rejected: "bg-red-50 text-red-600 border-red-200/80",
};

export default function ApplicationCard({ app, result, isJobAvailable }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-white rounded-2xl p-6 border border-zinc-200/80 hover:border-teal-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4">
      {/* Main Card Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5 flex-1 min-w-0">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isJobAvailable && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100/70 text-teal-800">
                {result.data.type}
              </span>
            )}

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[app.status?.toLowerCase()] ||
                "bg-zinc-100 text-zinc-700 border-zinc-200/80"
              }`}
            >
              {app.status?.toUpperCase()}
            </span>
          </div>

          {/* Dynamic Content States */}
          {result.isPending ? (
            <div className="space-y-1.5 animate-pulse">
              <div className="h-5 bg-zinc-200 rounded-md w-48" />
              <div className="h-4 bg-zinc-100 rounded-md w-32" />
            </div>
          ) : result.isError ? (
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Application #{app.jobId.slice(0, 8)}
              </h2>
              <p className="text-xs text-red-500 font-medium mt-0.5">
                Couldn't load details for this position.
              </p>
            </div>
          ) : !result.data ? (
            <div>
              <h2 className="text-base font-semibold text-zinc-400 italic">
                Position Unavailable
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                This job listing has been removed by the employer.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 tracking-tight truncate">
                {result.data.title}
              </h2>
              <p className="text-sm font-medium text-zinc-600 mt-0.5">
                {result.data.company} • 📍 {result.data.location}
              </p>
            </div>
          )}

          {/* Applied Date */}
          <p className="text-xs text-zinc-400">
            Applied on{" "}
            {new Date(app.appliedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Action Controls */}
        {!result.isPending && !result.isError && (
          <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>
                {isExpanded ? "Hide Application" : "View Application"}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {result.data ? (
              <Link
                to={`/jobs/${app.jobId}`}
                className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-teal-600 text-white font-medium text-xs transition-all cursor-pointer shadow-2xs"
              >
                View Job
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-400 bg-zinc-50 font-medium text-xs">
                Job Closed
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="pt-4 mt-2 border-t border-zinc-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Submitted Cover Letter
          </h3>
          <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/60 text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
            {app.coverLetter ||
              "No cover letter submitted with this application."}
          </div>
        </div>
      )}
    </article>
  );
}
