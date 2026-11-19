import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApplication, getJob } from "../api/jobs";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import useDeleteJob from "../hooks/useDeleteJob";
import { useState } from "react";
import ApplicationForm from "../components/ApplicationForm";
import { useSavedJobs } from "../hooks/useSavedJobs";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function JobsDetails() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const jobId = params.jobId;
  const userId = localStorage.getItem("userId");

  const { savedJobIds, saveMutation, unsaveMutation, isSavedJobsPending } =
    useSavedJobs();

  const isSaved = savedJobIds.includes(jobId);

  const isSaveDisabled =
    isSavedJobsPending ||
    (saveMutation.isPending && saveMutation.variables === jobId) ||
    (unsaveMutation.isPending && unsaveMutation.variables === jobId);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
  });

  const {
    data: jobAppData,
    isPending: isPendingJobApp,
    isError: isJobAppError,
    // error: jobAppError,
  } = useQuery({
    queryKey: ["job-application", userId, jobId],
    queryFn: () => getApplication(userId, jobId),
    enabled: !!userId,
  });

  const hasApplied = !!userId && !!jobAppData;
  const isCheckingApplication = !!userId && isPendingJobApp;

  const applyButtonText = hasApplied
    ? "✓ Applied"
    : isCheckingApplication
      ? "Checking..."
      : isJobAppError
        ? "Couldn't check application status"
        : "Apply Now";

  const {
    mutate: deleteJobMutation,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteJob({
    onSuccess: () => navigate("/"),
  });

  function handleDelete() {
    setIsDeleteModalOpen(true);
  }
  function confirmDelete() {
    deleteJobMutation(jobId);
  }
  function handleApplyClick() {
    if (!userId) {
      return navigate("/auth");
    }

    if (hasApplied || isCheckingApplication || isJobAppError) {
      return;
    }

    setIsApplyModalOpen(true);
  }

  function handleApplicationSuccess() {
    dispatch(
      notificationActions.showNotification({
        state: "success",
        title: "Success!",
        message: "Application sent successfully!",
      }),
    );
  }

  function handleSaveToggle() {
    if (!userId) {
      navigate("/auth");
      return;
    }

    if (isSaved) {
      unsaveMutation.mutate(jobId);
    } else {
      saveMutation.mutate(jobId);
    }
  }

  if (isPending) {
    return <LoadingSpinner label="Loading Job Details" />;
  }

  if (isError) {
    return <ErrorBlock message={error.message} onRetry={refetch} />;
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p>Job Not Found</p>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          ← Back to all jobs
        </Link>
      </div>
    );
  }
  const isOwner = userId && userId === data.ownerId;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          ← Back to all jobs
        </Link>
      </div>
      {isDeleteError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError.message}
        </div>
      )}
      {/* Main Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100/70 text-teal-800">
                {data.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                📍 {data.location}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {data.title}
            </h1>
            <p className="text-base text-zinc-600 font-medium mt-1">
              {data.company} • Posted{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {isOwner ? (
              <>
                <Link
                  to={`/jobs/${jobId}/edit`}
                  className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium text-sm transition-all cursor-pointer inline-flex items-center justify-center"
                >
                  Edit Job
                </Link>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-full border border-zinc-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete Job"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSaveToggle}
                  disabled={isSaveDisabled}
                  className={`px-4 py-2.5 rounded-full border font-medium text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSaved
                      ? "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                  aria-label={isSaved ? "Remove saved job" : "Save job"}
                >
                  {isSaved ? "✓ Saved" : "Save Job"}
                </button>
                <button
                  type="button"
                  disabled={
                    isCheckingApplication || hasApplied || isJobAppError
                  }
                  onClick={handleApplyClick}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer disabled:cursor-not-allowed ${
                    isJobAppError
                      ? "bg-red-50 text-red-600 border border-red-200/80 shadow-none"
                      : hasApplied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-none"
                        : isCheckingApplication
                          ? "bg-teal-500 text-white opacity-80 shadow-xs"
                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                  }`}
                >
                  {applyButtonText}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-sm">
          <div>
            <span className="block text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Salary Range
            </span>
            <span className="font-semibold text-zinc-900 mt-0.5 block">
              {data.salary}
            </span>
          </div>
          <div>
            <span className="block text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Experience
            </span>
            <span className="font-semibold text-zinc-900 mt-0.5 block">
              {data.experienceLevel || "Not Specified"}
            </span>
          </div>
          <div>
            <span className="block text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Department
            </span>
            <span className="font-semibold text-zinc-900 mt-0.5 block">
              {data.department || "Not Specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs">
        {/* Role Overview */}
        <section>
          <h2 className="text-lg font-bold text-zinc-900 mb-3">
            About the Role
          </h2>
          <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">
            {data.description}
          </p>
        </section>

        {/* Responsibilities */}
        {data.responsibilities?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              Key Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
              {data.responsibilities.map((res) => (
                <li key={res}>{res}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements */}
        {data.requirements?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              Requirements & Qualifications
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
              {data.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Benefits */}
        {data.benefits?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-zinc-900 mb-3">
              Benefits & Perks
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800"
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationForm
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={jobId}
        onApplicationSuccess={handleApplicationSuccess}
      />

      {/* Deletion Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
