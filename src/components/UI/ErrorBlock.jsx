export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16 px-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 max-w-xl mx-auto my-8">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        An Error Occurred
      </h3>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
        {message ||
          "An unexpected error occurred while fetching information. Please check your connection and try again."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-semibold rounded-full border border-zinc-200 dark:border-zinc-700 shadow-2xs transition-all cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
