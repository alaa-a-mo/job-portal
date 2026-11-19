import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createNewJob } from "../api/jobs";
import queryClient from "../api/queryClient";
import JobForm from "../components/JobForm";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationSlice";

export default function NewJob() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewJob,

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      dispatch(
        notificationActions.showNotification({
          state: "success",
          title: "Success!",
          message: "Job created successfully.",
        }),
      );
      navigate(`/jobs/${data.name}`);
    },
    onError: () => {
      dispatch(
        notificationActions.showNotification({
          state: "error",
          title: "Job Creation Failed!",
          message: "Failed to create job, please try again.",
        }),
      );
    },
  });

  function handleSubmit(formValues) {
    const ownerId = localStorage.getItem("userId");

    if (!ownerId) {
      alert("Please log in before posting a job!");
      return;
    }

    const job = {
      ...formValues,
      ownerId,
      createdAt: new Date().toISOString(),
    };

    mutate(job);
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <JobForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isPending}
      isError={isError}
      error={error}
    />
  );
}
