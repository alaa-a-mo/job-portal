import { DATABASE_URL } from "./database";
import { logout, verifyToken } from "./authUtils";

function getToken() {
  return localStorage.getItem("token");
}

async function checkResponse(response, errorMessage) {
  if (response.ok) return;

  if (response.status === 401) {
    const token = getToken();

    if (token && !(await verifyToken(token))) {
      logout();
      window.location.assign("/auth?sessionExpired=true");

      throw new Error("Your session has expired. Please log in again.");
    }
  }

  throw new Error(errorMessage);
}

export async function getJobs() {
  const response = await fetch(`${DATABASE_URL}/jobs.json`);

  await checkResponse(response, "Failed to fetch jobs.");

  const data = await response.json();

  if (!data) {
    return [];
  }

  return Object.entries(data).map(([id, job]) => ({
    id,
    ...job,
  }));
}

export async function getJob(jobId) {
  const response = await fetch(`${DATABASE_URL}/jobs/${jobId}.json`);

  await checkResponse(response, "Failed to fetch job.");

  const data = await response.json();

  if (!data) {
    return null;
  }

  return {
    id: jobId,
    ...data,
  };
}

export async function createNewJob(jobData) {
  const token = getToken();

  const response = await fetch(`${DATABASE_URL}/jobs.json?auth=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  await checkResponse(response, "Failed to create job.");

  const result = await response.json();

  return result;
}

export async function deleteJob(jobId) {
  const token = getToken();

  const applications = await getApplicationsForJob(jobId);

  const updates = {
    [`jobs/${jobId}`]: null,
  };

  Object.keys(applications).forEach((applicantId) => {
    updates[`applicationsByJob/${jobId}/${applicantId}`] = null;
    updates[`applicationsByUser/${applicantId}/${jobId}`] = null;
  });

  const response = await fetch(`${DATABASE_URL}.json?auth=${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  await checkResponse(response, "Failed to delete job and its applications.");
}

export async function updateJob(jobId, updatedData) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/jobs/${jobId}.json?auth=${token}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    },
  );

  await checkResponse(response, "Failed to update job.");

  const result = await response.json();

  return result;
}

export async function getSavedJobIds(userId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/savedJobs/${userId}.json?auth=${token}`,
  );

  await checkResponse(response, "Failed to fetch saved jobs.");

  const data = await response.json();

  return data ? Object.keys(data) : [];
}

export async function saveJob(userId, jobId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/savedJobs/${userId}/${jobId}.json?auth=${token}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(true),
    },
  );

  await checkResponse(response, "Failed to save job.");
}

export async function unsaveJob(userId, jobId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/savedJobs/${userId}/${jobId}.json?auth=${token}`,
    {
      method: "DELETE",
    },
  );

  await checkResponse(response, "Failed to remove saved job.");
}

export async function applyForJob(jobData) {
  const token = getToken();
  const status = "pending";
  const appliedAt = new Date().toISOString();
  const fullName = jobData.fullName;
  const email = jobData.email;
  const coverLetter = jobData.coverLetter;
  const jobId = jobData.jobId;
  const applicantId = jobData.applicantId;

  const application = {
    fullName,
    email,
    coverLetter,
    status,
    appliedAt,
  };

  const updates = {
    [`applicationsByJob/${jobId}/${applicantId}`]: application,
    [`applicationsByUser/${applicantId}/${jobId}`]: application,
  };

  const response = await fetch(`${DATABASE_URL}.json?auth=${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  await checkResponse(response, "Couldn't submit application.");

  return "Application Submitted Successfully!";
}

export async function updateApplicationStatus(jobId, applicantId, status) {
  const token = getToken();

  const updates = {
    [`applicationsByJob/${jobId}/${applicantId}/status`]: status,
    [`applicationsByUser/${applicantId}/${jobId}/status`]: status,
  };

  const response = await fetch(`${DATABASE_URL}.json?auth=${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  await checkResponse(response, "Failed to update job status");

  return "Status Updated Successfully!";
}

export async function getApplication(userId, jobId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/applicationsByUser/${userId}/${jobId}.json?auth=${token}`,
  );

  await checkResponse(response, "Failed to fetch data");

  const result = await response.json();

  return result;
}

export async function getMyApplications(applicantId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/applicationsByUser/${applicantId}.json?auth=${token}`,
  );

  await checkResponse(response, "Failed to fetch applications");

  const data = await response.json();

  return data
    ? Object.entries(data).map(([jobId, application]) => ({
        jobId,
        ...application,
      }))
    : [];
}

async function getApplicationsForJob(jobId) {
  const token = getToken();

  const response = await fetch(
    `${DATABASE_URL}/applicationsByJob/${jobId}.json?auth=${token}`,
  );

  await checkResponse(response, "Couldn't fetch job data");

  const result = await response.json();

  return result ?? {};
}

export async function getEmployerApplications(userId) {
  const jobs = await getJobs();

  const employerJobs = jobs.filter((job) => job.ownerId === userId);

  const appPromises = employerJobs.map(async (job) => {
    const applications = await getApplicationsForJob(job.id);
    return { job, applications };
  });

  const result = await Promise.all(appPromises);

  return result.map(({ job, applications }) => ({
    job,
    applications: Object.entries(applications).map(
      ([applicantId, application]) => ({
        applicantId,
        ...application,
      }),
    ),
  }));
}
