import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authAction, authLoader } from "./actions/authActions";
import { getAuthToken } from "./api/authUtils";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./api/queryClient";
import RootLayout from "./pages/RootLayout";
import Jobs from "./pages/Jobs";
import JobsDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import AuthenticationPage from "./pages/Authentication";
import ErrorPage from "./pages/ErrorPage";
import "./api/database";
import NewJob from "./pages/NewJob";
import { requireAuth } from "./loaders/requireAuth";
import MyJobs from "./pages/MyJobs";
import JobEdit from "./pages/JobEdit";
import MyApplications from "./pages/MyApplications";
import EmployerApplications from "./pages/EmployerApplications";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: getAuthToken,
    id: "root",
    children: [
      {
        index: true,
        element: <Jobs />,
      },
      {
        path: "jobs",
        children: [
          { path: ":jobId", element: <JobsDetails /> },
          {
            loader: requireAuth,
            children: [
              { path: "new", element: <NewJob /> },
              { path: "my-jobs", element: <MyJobs /> },
              { path: "saved-jobs", element: <SavedJobs /> },
              { path: ":jobId/edit", element: <JobEdit /> },
            ],
          },
        ],
      },
      {
        path: "my-applications",
        element: <MyApplications />,
        loader: requireAuth,
      },
      {
        path: "auth",
        element: <AuthenticationPage />,
        action: authAction,
        loader: authLoader,
      },
      {
        path: "employer-applications",
        element: <EmployerApplications />,
        loader: requireAuth,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
