import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../api/jobs";
import { useSavedJobs } from "../hooks/useSavedJobs";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";

export default function SavedJobs() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const {
    savedJobIds,
    isSavedJobsPending,
    isError: isSavedJobsError,
    error: savedJobsError,
  } = useSavedJobs();

  if (isPending || isSavedJobsPending) {
    return <LoadingSpinner label="Loading Your Saved Jobs" />;
  }

  if (isError || isSavedJobsError) {
    return (
      <ErrorBlock
        message={(error || savedJobsError).message}
        onRetry={refetch}
      />
    );
  }

  const savedJobs = data.filter((job) => savedJobIds.includes(job.id));
  if (savedJobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p>No Saved Jobs Found</p>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          ← Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
          Your Saved Jobs
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedJobs.map((job) => (
          <div key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
