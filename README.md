# JobPortal — React Job Board

A single-page job board where anyone can browse and search listings, and signed-in users can post jobs, save listings, apply with a cover letter, and (as employers) review and accept or reject applicants.

Built with **React 19**, **React Router (data router)**, **TanStack Query**, **Redux Toolkit**, **Tailwind CSS v4**, and **Firebase Authentication + Realtime Database** (accessed through their REST APIs).

> **Live demo:** https://job-portal-eta-bay-54.vercel.app/
> **Repository:** https://github.com/alaa-a-mo/job-portal

---

## Screenshots

| Browse jobs                                                        | Job details                                                         |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| ![Browse jobs](./src/assets/screenshots/job-portal-screenshot.png) | ![Job details](./src/assets/screenshots/job-details-screenshot.png) |

| Apply modal                                                         | Employer: received applications                                                         |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ![Apply modal](./src/assets/screenshots/apply-modal-screenshot.png) | ![Received applications](./src/assets/screenshots/received-applications-screenshot.png) |

| Dark mode: browse jobs                                                      | Dark mode: job details                                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Dark mode browse jobs](./src/assets/screenshots/dark-jobs-screenshot.png) | ![Dark mode job details](./src/assets/screenshots/dark-details-screenshot.png) |

| Mobile layout                                                           |
| ----------------------------------------------------------------------- |
| ![Mobile layout](./src/assets/screenshots/mobile-layout-screenshot.png) |

---

## Features

**For everyone**

- Browse all job listings
- Search by job title or company, and filter by employment type (Full-time, Part-time, Contract, Internship)
- View a full job page: description, responsibilities, requirements, benefits, salary, experience level, department
- Lazy loading and code splitting for secondary pages, reducing the initial JavaScript bundle and loading page code when needed
- Light and dark mode toggle with `localStorage` persistence, OS color-scheme detection, and flash-free initial load

**For signed-in users**

- Sign up and log in with email and password
- Save and unsave jobs, with a dedicated _Saved Jobs_ page
- Apply to a job with a full name, email, and cover letter (in an accessible native `<dialog>` modal)
- _My Applications_ page showing each application's status (pending / accepted / rejected); applications to jobs that were later removed are shown as "Position Unavailable"
- Protected routes: unauthenticated visitors are redirected to the login page, and logged-in users are redirected away from it
- Automatic logout when the session expires

**For employers (any signed-in user who posts jobs)**

- Post, edit, and delete job listings with a confirmation modal (including dynamic lists for responsibilities, requirements, and benefits)
- _My Posted Jobs_ page with applicant counts
- _Received Applications_ page grouped by job, with expandable cover letters, a "Reply via Email" link, and **Accept / Reject** actions

**General**

- Toast notifications for success and error feedback
- Loading, error (with retry), and empty states on the main pages
- Responsive layout with a collapsible mobile navigation

---

## Tech Stack

| Category            | Technologies                                                                |
| ------------------- | --------------------------------------------------------------------------- |
| **Frontend**        | React 19, Tailwind CSS v4 (class-based dark mode)                           |
| **Routing**         | React Router v7 (data router, loaders, actions, route-based code splitting) |
| **Server State**    | TanStack Query v5 (data fetching, mutations, cache invalidation)            |
| **Global UI State** | Redux Toolkit (notifications and toast messages)                            |
| **Authentication**  | Firebase Authentication (Identity Toolkit REST API)                         |
| **Database**        | Firebase Realtime Database (REST API)                                       |
| **Build Tool**      | Vite 8                                                                      |
| **Code Quality**    | ESLint 10, React Hooks and React Refresh plugins                            |

**API Integration:** Firebase services are accessed directly through the Fetch API. The Firebase JavaScript SDK is not used.

---

## Getting started

### Prerequisites

- Node.js **20.19+** or **22.12+** (required by Vite 8)
- A Firebase project (free Spark plan is enough)

### 1. Clone and install

```bash
git clone https://github.com/alaa-a-mo/job-portal.git
cd job-portal
npm install
```

### 2. Set up Firebase

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. **Authentication → Sign-in method:** enable **Email/Password**.
3. **Realtime Database → Create database** and note its URL (it looks like `https://<project-id>-default-rtdb.<region>.firebasedatabase.app`).
4. **Project settings → General → Your apps → Web app:** copy the **Web API key**.
5. Apply the security rules described in [Firebase security rules](#firebase-security-rules) before sharing the app with anyone.

### 3. Configure environment variables

Copy `.env.example` to `.env` in the project root, then replace the placeholder values with your own Firebase configuration.

```env
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.your-region.firebasedatabase.app
```

Notes:

- Vite exposes `VITE_*` variables to the browser bundle. A Firebase web API key is an identifier, not a secret, so security depends on your **database rules**, not on hiding the key. It is still good practice to restrict the key (HTTP referrers + only the Identity Toolkit API) in Google Cloud Console.
- Do not commit `.env`. Keep it listed in `.gitignore`.

### 4. Run

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

### Deployment

The project is deployed on Vercel.

**Production builds and code splitting**

- Vite generates an optimized production build in the `dist/` directory using `npm run build`.
- Secondary pages are lazy-loaded using React's `lazy()` and `Suspense`, so their JavaScript is downloaded when the corresponding page is needed rather than being included in the initial page load.
- Vite splits the application into separate JavaScript chunks during the production build.
- Use `npm run preview` to test the production build locally before deployment.

**Vercel configuration**

- The `vercel.json` configuration includes a rewrite rule that directs application routes to `index.html`, allowing React Router routes to work when users refresh or open URLs directly.
- Vercel builds and deploys the project from the connected GitHub repository.
- The Firebase environment variables must also be configured in Vercel under **Project Settings → Environment Variables**.

---

## Project structure

```
src/
├── actions/       # Router actions (login / signup)
├── api/           # Firebase REST helpers (auth, jobs, applications), query client, token utils
├── components/    # Reusable UI (JobCard, JobForm, ApplicationForm, MainNav, ...)
│   └── UI/        # LoadingSpinner, ErrorBlock, NotificationToast
├── hooks/         # useSavedJobs, useDeleteJob, useTheme
├── loaders/       # requireAuth route guard
├── pages/         # Route-level components
├── store/         # Redux store and notification slice
├── App.jsx        # Router configuration
└── main.jsx       # Entry point
```

---

## How it works

### Authentication

- Sign-up and login call the Firebase Identity Toolkit REST endpoints from a React Router **action**.
- On success, the ID token, user ID, email, and expiry time are stored in `localStorage`.
- A root route **loader** reads the token; protected routes use a `requireAuth` loader that redirects to `/auth` when the token is missing or expired.
- A timer in the root layout logs the user out when the token expires. Sessions last as long as the Firebase ID token (about one hour); there is no refresh-token flow yet.
- Database requests send the ID token as the `auth` query parameter.

### Data model (Realtime Database)

```
jobs/{jobId}                          title, company, location, type, salary, experienceLevel,
                                      department, description, responsibilities[], requirements[],
                                      benefits[], ownerId, createdAt
savedJobs/{userId}/{jobId}            true
applicationsByJob/{jobId}/{applicantId}    fullName, email, coverLetter, status, appliedAt
applicationsByUser/{applicantId}/{jobId}   same shape as above
```

Applications are stored in two places so employers can list applicants per job and applicants can list their own applications. Both copies are written (and status changes are applied) in a **single atomic multi-path update**, so they cannot drift apart.

### Application workflow

1. A signed-in user opens a job and clicks **Apply Now**; the app first checks whether they already applied and disables the button if so.
2. Submitting the modal writes the application with status `pending`.
3. The job owner opens **Received Applications**, reads the cover letter, and clicks **Accept** or **Reject**.
4. The applicant sees the updated status in **My Applications**.

### Job deletion

- Only the job owner can delete a job.
- Deleting a job also removes its associated applications from both `applicationsByJob` and `applicationsByUser`.
- The job and application records are removed using a single atomic multi-path update.
- A confirmation modal prevents accidental deletion.

### Theme & styling

- Dark mode is driven by a custom Tailwind v4 `@custom-variant dark` rule responding to the `.dark` class on `<html>`, paired with explicit `dark:` utility classes across layouts, cards, forms, modals, and pages.
- A `useTheme` hook in `MainNav` manages theme state, syncs `.dark` on `document.documentElement`, and persists the choice in `localStorage` (defaulting to `prefers-color-scheme` on first visit).
- An inline script in `index.html` applies the saved or system theme before first paint to prevent a flash of unstyled light mode.

### State management

- **Server state** (jobs, saved jobs, applications) lives in TanStack Query with per-user query keys; mutations invalidate the relevant queries.
- **UI state** that is not tied to the server (toast notifications) lives in Redux Toolkit.

---

## Firebase security rules

The Firebase Realtime Database rules enforce:

- Job ownership for creating, updating, and deleting job listings.
- Applicants can create their own applications.
- Applicants can read their own applications.
- Job owners can review applications submitted to their jobs and update their status.
- Users can access only their own saved jobs.

Authorization is enforced by Firebase independently of client-side checks.

See [`database.rules.json`](./database.rules.json) for the complete rules.

---

## Known limitations

- No automated tests.
- All jobs are downloaded and filtered/searched on the client; there is no pagination or server-side querying yet.
- Sessions end after about an hour (no token refresh).
- Deleting a job removes its related applications from both application records, but may leave orphaned saved-job entries.
- Authorization depends entirely on Firebase Realtime Database rules (the client-side ownership checks are for UX only).

---

## Author

**Alaa Atef** — Frontend Developer

[Portfolio](https://alaa-a-mo.github.io/portfolio/) / [LinkedIn](https://www.linkedin.com/in/alaa-atef96/) / [GitHub](https://github.com/alaa-a-mo)
