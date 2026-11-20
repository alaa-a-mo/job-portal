export default function ConfirmDeleteModal({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <h2
          id="delete-title"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Delete job?
        </h2>

        <p
          id="delete-description"
          className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          Are you sure you want to delete this job? This action cannot be
          undone. All applications associated with this job will also be
          deleted.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
