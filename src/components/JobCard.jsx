import { Link, useNavigate } from "react-router-dom";
import { useSavedJobs } from "../hooks/useSavedJobs";

export default function JobCard({
  job,
  showActions,
  onDelete,
  isDeleting,
  applicants,
}) {
  const navigate = useNavigate();
  const {
    userId,
    savedJobIds,
    saveMutation,
    unsaveMutation,
    isSavedJobsPending,
  } = useSavedJobs();

  const isSaved = savedJobIds.includes(job.id);
  const isSaveDisabled =
    isSavedJobsPending ||
    (saveMutation.isPending && saveMutation.variables === job.id) ||
    (unsaveMutation.isPending && unsaveMutation.variables === job.id);

  function handleSaveToggle() {
    if (!userId) {
      navigate("/auth");
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate(job.id);
    } else {
      saveMutation.mutate(job.id);
    }
  }

  return (
    <article className="group relative bg-white rounded-2xl p-6 border border-zinc-200/80 hover:border-teal-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Title + Actions (Bookmark + Admin Controls) */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-teal-700 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-zinc-600 mt-0.5">
              {job.company}
            </p>
          </div>

          {/* Right Action Cluster: Always show Bookmark, plus Admin Quick-Bar if showActions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Always-visible Save / Bookmark Button */}
            <button
              type="button"
              onClick={handleSaveToggle}
              disabled={isSaveDisabled}
              className={`transition-colors p-1.5 rounded-full hover:bg-zinc-100 cursor-pointer disabled:opacity-50 ${
                isSaved ? "text-teal-600" : "text-zinc-400 hover:text-teal-600"
              }`}
              aria-label={isSaved ? "Remove saved job" : "Save job"}
              title={isSaved ? "Remove saved job" : "Save job"}
            >
              <svg
                className="w-5 h-5"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* Optional Admin Quick-Bar */}
            {showActions && (
              <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200/80 rounded-full p-1">
                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="px-2.5 py-1 text-xs font-medium text-zinc-700 hover:text-teal-700 hover:bg-white rounded-full transition-all cursor-pointer"
                  title="Edit job"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDelete?.(job.id)}
                  className="px-2.5 py-1 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-white rounded-full disabled:opacity-50 transition-all cursor-pointer"
                  title="Delete job"
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges / Pill Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
            📍 {job.location}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100/70 text-teal-800">
            {job.type}
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-sm text-zinc-600 line-clamp-3 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Conditional Employer Applicants Section (Inline / Not Full-Width) */}
      {applicants !== undefined && (
        <div className="flex items-center justify-between gap-2 mb-4 py-3 px-4 bg-zinc-50/80 border border-zinc-200/60 rounded-2xl">
          <span className="text-xs font-medium text-zinc-600">
            Total Applicants:{" "}
            <strong className="text-zinc-900">{applicants}</strong>
          </span>
          <Link
            to={`/employer-applications?jobId=${job.id}`}
            className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-zinc-300 hover:border-teal-600 text-zinc-700 hover:text-teal-700 font-medium text-xs transition-all cursor-pointer bg-white"
          >
            View Applicants
          </Link>
        </div>
      )}

      {/* Footer / Standard View Button */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
        <span className="inline text-xs font-medium text-zinc-400">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center px-4 py-1.5 bg-zinc-900 hover:bg-teal-600 text-white text-xs font-medium rounded-full transition-all cursor-pointer shadow-2xs"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
