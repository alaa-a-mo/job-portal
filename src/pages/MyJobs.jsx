import { useQuery } from "@tanstack/react-query";
import { getEmployerApplications, getJobs } from "../api/jobs";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import useDeleteJob from "../hooks/useDeleteJob";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function MyJobs() {
  const [selectedJobId, setSelectedJobId] = useState(null);

  const userId = localStorage.getItem("userId");
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const { data: employerApplications } = useQuery({
    queryKey: ["apps", userId],
    queryFn: () => getEmployerApplications(userId),
  });

  const {
    mutate: deleteJobMutation,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteJob({
    onSuccess: () => setSelectedJobId(null),
  });

  function handleDelete(jobId) {
    setSelectedJobId(jobId);
  }
  function confirmDelete() {
    deleteJobMutation(selectedJobId);
  }

  if (isPending) {
    return <LoadingSpinner label="Loading Your Jobs" />;
  }

  if (isError) {
    return <ErrorBlock message={error.message} onRetry={refetch} />;
  }
  const filteredJobs = data.filter((job) => job.ownerId === userId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
          My Job Listings
        </h1>
      </div>
      {isDeleteError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError.message}
        </div>
      )}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const jobApplications = employerApplications?.find(
              (item) => item.job.id === job.id,
            );
            return (
              <div key={job.id}>
                <JobCard
                  applicants={jobApplications?.applications.length ?? 0}
                  job={job}
                  showActions
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <p className="text-base font-semibold text-zinc-900 mb-1">
            No jobs posted yet.
          </p>
          <Link
            to={"/jobs/new"}
            className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-teal-700 transition-colors cursor-pointer"
          >
            Create your first job listing →
          </Link>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={!!selectedJobId}
        onCancel={() => setSelectedJobId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
