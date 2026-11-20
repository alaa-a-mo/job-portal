import { useState } from "react";
import JobCard from "../components/JobCard";
import { getJobs } from "../api/jobs";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
export default function Jobs() {
  const [selectedFilter, setSelectedFilter] = useState("All Jobs");
  const [searchText, setSearchText] = useState("");
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const filters = [
    "All Jobs",
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
  ];

  function handleFilterClick(filter) {
    setSelectedFilter(filter);
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorBlock message={error.message} onRetry={refetch} />;
  }
  const filteredJobs = [...data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(
      (job) =>
        (job.type === selectedFilter || selectedFilter === "All Jobs") &&
        ((job.title || "")
          .toLowerCase()
          .includes(searchText.toLowerCase().trim()) ||
          (job.company || "")
            .toLowerCase()
            .includes(searchText.toLowerCase().trim())),
    );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
          Find Your Next Opportunity!
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
          Discover our up to date jobs.
        </p>
      </div>
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 transition-all focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
          <div className="relative w-full flex items-center">
            <svg
              className="absolute left-4 w-5 h-5 text-zinc-400 dark:text-zinc-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <label htmlFor="search-input" className="sr-only">
              Search jobs
            </label>
            <input
              type="text"
              name="search-input"
              id="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-11 pr-4 py-3 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none"
            />
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap items-center justify-center sm:justify-center gap-2 pb-2 mb-12">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                type="button"
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  filter === selectedFilter
                    ? "bg-teal-100/80 dark:bg-teal-950/90 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-semibold"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800"
                }`}
              >
                {filter}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            No jobs found
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Try searching for something else or changing your filters.
          </p>
        </div>
      )}
    </div>
  );
}
