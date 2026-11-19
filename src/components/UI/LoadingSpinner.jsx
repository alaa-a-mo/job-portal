export default function LoadingSpinner({ label = "Loading jobs..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated Ring */}
      <div className="w-10 h-10 border-3 border-zinc-200 border-t-teal-600 rounded-full animate-spin mb-3" />

      {/* Optional Label */}
      {label && (
        <p className="text-sm font-medium text-zinc-500 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
