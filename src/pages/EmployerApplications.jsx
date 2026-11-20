import { getEmployerApplications } from "../api/jobs";
import EmployerApplicationsCard from "../components/EmployerApplicationCard";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import { useQuery } from "@tanstack/react-query";

export default function EmployerApplications() {
  const [searchParams] = useSearchParams();
  const selectedJobId = searchParams.get("jobId");

  const userId = localStorage.getItem("userId");
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["apps", userId],
    queryFn: () => getEmployerApplications(userId),
  });

  if (isPending) {
    return <LoadingSpinner label="Loading job applications..." />;
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorBlock message={error.message} onRetry={refetch} />
      </div>
    );
  }

  const selectedJobs = selectedJobId
    ? data.filter((item) => item.job.id === selectedJobId)
    : data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/jobs/my-jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors mb-3"
        >
          <span>←</span>
          <span>Back to My Posted Jobs</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Received Applications
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review candidates and manage hiring decisions across your listings.
        </p>
      </div>

      {selectedJobs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200/80 dark:border-zinc-800">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
            💼
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No jobs posted yet
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto mb-6">
            You haven't created any job listings yet. Post an open role to start
            receiving applications from candidates.
          </p>
          <Link
            to="/jobs/new"
            className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-full transition-all shadow-xs"
          >
            Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {selectedJobs.map(({ job, applications }) => (
            <section key={job.id} className="space-y-4">
              <div className="bg-zinc-50/90 dark:bg-zinc-900/90 rounded-2xl px-5 py-4 border border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors truncate"
                    >
                      {job.title}
                    </Link>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100/70 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200">
                      {job.type}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      • 📍 {job.location}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    {applications?.length || 0}{" "}
                    {applications?.length === 1 ? "Applicant" : "Applicants"}
                  </span>
                </div>
              </div>

              {applications.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    No applications received for this job yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((application, index) => (
                    <EmployerApplicationsCard
                      key={application.applicantId + index}
                      application={application}
                      jobId={job.id}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
