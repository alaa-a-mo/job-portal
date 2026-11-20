export default function LoadingSpinner({ label = "Loading jobs..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-10 h-10 border-3 border-zinc-200 dark:border-zinc-800 border-t-teal-600 dark:border-t-teal-400 rounded-full animate-spin mb-3" />

      {label && (
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
