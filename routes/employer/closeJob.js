const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getCloseJobUrl = (jobId) => `${BASE}/employer/closejob/${jobId}`;