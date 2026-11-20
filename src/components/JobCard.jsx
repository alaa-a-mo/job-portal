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
    <article className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-md dark:hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">
              {job.company}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveToggle}
              disabled={isSaveDisabled}
              className={`transition-colors p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50 ${
                isSaved
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-teal-600 dark:hover:text-teal-400"
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

            {showActions && (
              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 rounded-full p-1">
                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-white dark:hover:bg-zinc-700 rounded-full transition-all cursor-pointer"
                  title="Edit job"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => onDelete?.(job.id)}
                  className="px-2.5 py-1 text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-white dark:hover:bg-zinc-700 rounded-full disabled:opacity-50 transition-all cursor-pointer"
                  title="Delete job"
                >
                  {isDeleting ? "..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            📍 {job.location}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100/70 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200">
            {job.type}
          </span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 mb-4 leading-relaxed">
          {job.description}
        </p>
      </div>

      {applicants !== undefined && (
        <div className="flex items-center justify-between gap-2 mb-4 py-3 px-4 bg-zinc-50/80 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/80 rounded-2xl">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Total Applicants:{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {applicants}
            </strong>
          </span>
          <Link
            to={`/employer-applications?jobId=${job.id}`}
            className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:border-teal-600 dark:hover:border-teal-400 text-zinc-700 dark:text-zinc-200 hover:text-teal-700 dark:hover:text-teal-300 font-medium text-xs transition-all cursor-pointer bg-white dark:bg-zinc-900"
          >
            View Applicants
          </Link>
        </div>
      )}

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <span className="inline text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {new Date(job.createdAt).toLocaleDateString()}
        </span>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center px-4 py-1.5 bg-zinc-900 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-medium rounded-full transition-all cursor-pointer shadow-2xs"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
