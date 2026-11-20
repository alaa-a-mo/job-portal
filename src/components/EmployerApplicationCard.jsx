import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateApplicationStatus } from "../api/jobs";
import queryClient from "../api/queryClient";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export default function EmployerApplicationsCard({ application, jobId }) {
  const statusColors = {
    pending:
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/70",
    accepted:
      "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/70",
    rejected:
      "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-800/70",
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const nameInitials = application.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const dispatch = useDispatch();
  const applicantId = application.applicantId;
  const { mutate, isPending, isError, error, variables } = useMutation({
    mutationFn: ({ jobId, applicantId, status }) =>
      updateApplicationStatus(jobId, applicantId, status),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["apps"] });

      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: `Application ${variables.status} successfully!`,
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "An Error Occurred!",
          message: "Couldn't change application status. Please try again.",
        }),
      );
    },
  });

  function handleClick() {
    setIsExpanded(!isExpanded);
  }

  function handleAccept() {
    mutate({ jobId, applicantId, status: "accepted" });
  }

  function handleReject() {
    mutate({ jobId, applicantId, status: "rejected" });
  }

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 hover:border-teal-500/50 hover:shadow-md dark:hover:shadow-black/40 transition-all duration-200 flex flex-col justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-800/70 text-teal-800 dark:text-teal-200 font-bold text-sm flex items-center justify-center shrink-0">
            {nameInitials}
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {application.fullName}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  statusColors[application.status] ||
                  "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {application.status}
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {application.email}
            </p>

            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Applied on{" "}
              {new Date(application.appliedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleClick}
            type="button"
            className="px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Cover Letter</span>
            <svg
              className={`w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 transition-transform ${isExpanded && "rotate-180"}`}
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

          {application.status === "pending" && (
            <>
              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 rounded-full p-1">
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isPending}
                  className="px-3 py-1 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/70 transition-all cursor-pointer"
                >
                  {variables?.status === "accepted" && isPending
                    ? "Sending..."
                    : "Accept"}
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isPending}
                  className="px-3 py-1 rounded-full text-xs font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/70 transition-all cursor-pointer"
                >
                  {variables?.status === "rejected" && isPending
                    ? "Sending..."
                    : "Reject"}
                </button>
              </div>
              {isError && (
                <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5">
                  {error.message}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="pt-4 mt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Cover Letter
            </h4>
            <a
              href={`mailto:${application.email}`}
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              Reply via Email →
            </a>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {application.coverLetter}
          </div>
        </div>
      )}
    </article>
  );
}
