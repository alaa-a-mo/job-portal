import { Link, useNavigate, useParams } from "react-router-dom";
import { getJob, updateJob } from "../api/jobs";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ErrorBlock from "../components/UI/ErrorBlock";
import JobForm from "../components/JobForm";
import queryClient from "../api/queryClient";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export default function JobEdit() {
  const params = useParams();
  const jobId = params.jobId;
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
  });

  const {
    mutate,
    isPending: isPendingEdit,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: ({ jobId, updatedData }) => updateJob(jobId, updatedData),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["job", jobId] }),
        queryClient.invalidateQueries({ queryKey: ["jobs"] }),
      ]);
      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: "Job edited successfully!",
        }),
      );
      navigate(`/jobs/${jobId}`);
    },
    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "An error occurred!",
          message: "Failed to edit job. Please try again.",
        }),
      );
    },
  });

  function handleSubmit(formValues) {
    mutate({ jobId, updatedData: formValues });
  }

  function handleCancel() {
    navigate(-1);
  }

  if (isPending) {
    return <LoadingSpinner label="Loading Job for Editing" />;
  }

  if (isError) {
    return <ErrorBlock message={error.message} onRetry={refetch} />;
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-zinc-800 dark:text-zinc-200 mb-2">Job Not Found</p>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          ← Back to all jobs
        </Link>
      </div>
    );
  }
  const isOwner = userId && userId === data.ownerId;

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-zinc-800 dark:text-zinc-200 mb-2">
          You are not authorized to edit this job.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          ← Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <JobForm
      initialData={data}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isPendingEdit}
      isError={isEditError}
      error={editError}
    />
  );
}
