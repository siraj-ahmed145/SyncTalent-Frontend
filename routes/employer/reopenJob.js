const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getReopenJobUrl = (jobId) =>
  `${BASE}/employer/updatejob/${jobId}`;