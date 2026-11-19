import { useMutation, useQuery } from "@tanstack/react-query";
import { getSavedJobIds, saveJob, unsaveJob } from "../api/jobs";
import queryClient from "../api/queryClient";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export function useSavedJobs() {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const savedJobsQuery = useQuery({
    queryKey: ["savedJobs", userId],
    queryFn: () => getSavedJobIds(userId),
    enabled: !!userId,
  });

  const saveMutation = useMutation({
    mutationFn: (jobId) => saveJob(userId, jobId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savedJobs", userId],
      });

      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: "Job saved successfully!",
        }),
      );
    },

    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "An error occurred!",
          message: "Failed to save job. Please try again.",
        }),
      );
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (jobId) => unsaveJob(userId, jobId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["savedJobs", userId],
      });
      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: "Job unsaved successfully!",
        }),
      );
    },
    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "An error occurred!",
          message: "Failed to unsave job. Please try again.",
        }),
      );
    },
  });

  return {
    userId,
    savedJobIds: savedJobsQuery.data ?? [],
    isSavedJobsPending: !!userId && savedJobsQuery.isPending,
    isError: savedJobsQuery.isError,
    error: savedJobsQuery.error,
    saveMutation,
    unsaveMutation,
  };
}
