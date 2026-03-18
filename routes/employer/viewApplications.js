const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getViewApplicationsUrl = (jobId) =>
  `${BASE}/employer/view_applications/${jobId}`;