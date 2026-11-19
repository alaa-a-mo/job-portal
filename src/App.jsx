import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authAction, authLoader } from "./actions/authActions";
import { getAuthToken } from "./api/authUtils";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./api/queryClient";
import RootLayout from "./pages/RootLayout";
import Jobs from "./pages/Jobs";
import ErrorPage from "./pages/ErrorPage";
import "./api/database";
import { requireAuth } from "./loaders/requireAuth";

const JobDetails = lazy(() => import("./pages/JobDetails"));
const NewJob = lazy(() => import("./pages/NewJob"));
const MyJobs = lazy(() => import("./pages/MyJobs"));
const JobEdit = lazy(() => import("./pages/JobEdit"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const EmployerApplications = lazy(() => import("./pages/EmployerApplications"));
const AuthenticationPage = lazy(() => import("./pages/Authentication"));

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
          {
            path: ":jobId",
            element: (
              <Suspense
                fallback={
                  <p className="py-10 text-center text-slate-500">Loading...</p>
                }
              >
                <JobDetails />
              </Suspense>
            ),
          },
          {
            loader: requireAuth,
            children: [
              {
                path: "new",
                element: (
                  <Suspense
                    fallback={
                      <p className="py-10 text-center text-slate-500">
                        Loading...
                      </p>
                    }
                  >
                    <NewJob />
                  </Suspense>
                ),
              },
              {
                path: "my-jobs",
                element: (
                  <Suspense
                    fallback={
                      <p className="py-10 text-center text-slate-500">
                        Loading...
                      </p>
                    }
                  >
                    <MyJobs />
                  </Suspense>
                ),
              },
              {
                path: "saved-jobs",
                element: (
                  <Suspense
                    fallback={
                      <p className="py-10 text-center text-slate-500">
                        Loading...
                      </p>
                    }
                  >
                    <SavedJobs />
                  </Suspense>
                ),
              },
              {
                path: ":jobId/edit",
                element: (
                  <Suspense
                    fallback={
                      <p className="py-10 text-center text-slate-500">
                        Loading...
                      </p>
                    }
                  >
                    <JobEdit />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "my-applications",
        element: (
          <Suspense
            fallback={
              <p className="py-10 text-center text-slate-500">Loading...</p>
            }
          >
            <MyApplications />
          </Suspense>
        ),
        loader: requireAuth,
      },
      {
        path: "auth",
        element: (
          <Suspense
            fallback={
              <p className="py-10 text-center text-slate-500">Loading...</p>
            }
          >
            <AuthenticationPage />
          </Suspense>
        ),
        action: authAction,
        loader: authLoader,
      },
      {
        path: "employer-applications",
        element: (
          <Suspense
            fallback={
              <p className="py-10 text-center text-slate-500">Loading...</p>
            }
          >
            <EmployerApplications />
          </Suspense>
        ),
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
