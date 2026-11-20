import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyForJob } from "../api/jobs";
import queryClient from "../api/queryClient";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export default function ApplicationForm({
  isOpen,
  onClose,
  jobId,
  onApplicationSuccess,
}) {
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const { mutate, isPending, isError } = useMutation({
    mutationFn: applyForJob,
    onSuccess: () => {
      onClose();
      formRef.current?.reset();
      queryClient.invalidateQueries({
        queryKey: ["job-application", userId, jobId],
      });
      onApplicationSuccess();
    },
    onError: () => {
      onClose();
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "Application Failed",
          message:
            "Sorry, we couldn't submit your application. Please try again.",
        }),
      );
      setValidationErrors({});
    },
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
      setValidationErrors({});
      formRef.current?.reset();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();

    const applicantId = localStorage.getItem("userId");

    if (!applicantId) {
      return navigate("/auth");
    }
    const formData = new FormData(e.currentTarget);
    const coverLetter = formData.get("coverLetter");
    const fullName = formData.get("fullName");
    const errors = {};
    if (coverLetter.trim().length === 0) {
      errors.coverLetter = "Please enter a cover letter";
    }
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
      errors.fullName = "Please enter your full name";
    }
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    const data = Object.fromEntries(formData);
    const jobData = { ...data, jobId, applicantId };

    mutate(jobData);
  }

  function handleClose() {
    onClose();
    setValidationErrors({});
    formRef.current?.reset();
  }
  return (
    <dialog
      ref={dialogRef}
      className="m-auto p-0 bg-transparent backdrop:bg-zinc-900/50 dark:backdrop:bg-black/70 backdrop:backdrop-blur-xs open:animate-in open:fade-in open:zoom-in-95 duration-200 max-w-lg w-full rounded-3xl shadow-xl"
    >
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Apply for Role
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Submit your details below to submit your application.
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
            onClick={handleClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          ref={formRef}
          className="space-y-4 overflow-y-auto pr-1"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              onChange={() =>
                setValidationErrors((prev) => ({ ...prev, fullName: "" }))
              }
              required
              placeholder="e.g. Jane Doe"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${validationErrors.fullName ? "border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-teal-500"}`}
            />
            {validationErrors.fullName && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. jane@example.com"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="coverLetter"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={4}
              onChange={() =>
                setValidationErrors((prev) => ({ ...prev, coverLetter: "" }))
              }
              required
              placeholder="Tell us why you're a great fit..."
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${validationErrors.coverLetter ? "border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-teal-500"}`}
            />
            {validationErrors.coverLetter && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {validationErrors.coverLetter}
              </p>
            )}
          </div>
          {isError && (
            <p className="text-xs text-red-500 dark:text-red-400">
              Sorry, we couldn't submit your application. Please try again
            </p>
          )}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2.5 rounded-full text-white font-semibold text-xs transition-all shadow-xs ${isPending ? "bg-gray-400 dark:bg-zinc-700" : "bg-teal-600 hover:bg-teal-700 cursor-pointer"}`}
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
