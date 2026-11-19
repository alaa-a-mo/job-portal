import { useMutation } from "@tanstack/react-query";
import { deleteJob } from "../api/jobs";
import queryClient from "../api/queryClient";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export default function useDeleteJob(options = {}) {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: deleteJob,

    onSuccess: async (...args) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job"] });

      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: "Job deleted successfully!",
        }),
      );

      options.onSuccess?.(...args);
    },
    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "An error occurred!",
          message: "Failed to delete job. Please try again.",
        }),
      );
    },
  });
}
