export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16 px-6 bg-zinc-50 rounded-3xl border border-zinc-200/80 max-w-xl mx-auto my-8">
      {/* Warning / Error Icon */}
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-50 text-red-600">
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

      {/* Heading */}
      <h3 className="text-lg font-semibold text-zinc-900 mb-1">
        An Error Occurred
      </h3>

      {/* Dynamic Error Message */}
      <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
        {message ||
          "An unexpected error occurred while fetching information. Please check your connection and try again."}
      </p>

      {/* Optional Retry Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold rounded-full border border-zinc-200 shadow-2xs transition-all cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
